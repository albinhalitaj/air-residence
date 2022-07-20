using System.Net;
using AirPlaces.API.AppSettings;
using AirPlaces.API.DTOs;
using AirPlaces.API.Interfaces;
using AirPlaces.Entities;
using AirPlaces.Entities.Models;
using Amazon.S3.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace AirPlaces.API.Services;

public class ResidenceService : IResidenceService
{
    private readonly ApplicationContext _ctx;
    private readonly IAmazonS3Service _amazonS3Service;
    private readonly IAzureService _azureService;
    private readonly S3Settings _s3;

    public ResidenceService(ApplicationContext ctx,
        IAmazonS3Service amazonS3Service,IAzureService azureService,IOptions<S3Settings> s3Settings)
    {
        _ctx = ctx;
        _amazonS3Service = amazonS3Service;
        _azureService = azureService;
        _s3 = s3Settings.Value;
    }
    
    public Task GetResidences() => _ctx.Residences.Include(x=>x.Images).ToListAsync();

    public async Task<Guid> AddResidence(ResidenceRequest request, IFormFileCollection images)
    {
        var residence = new Residence
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            Address = request.Address,
            City = request.City,
            Country = request.Country,
            ZipCode = request.ZipCode,
            OwnerName = request.OwnerName,
            Email = request.Email,
            Phone = request.Phone,
            Price = request.Price
        };

        var succeded = false;

        await _ctx.Residences.AddAsync(residence);
        var res = await _ctx.SaveChangesAsync();

        if (res != 1) return Guid.Empty;
        var imageList = TransformAzureImages(residence, images);
        var result = await _azureService.UploadImagesAsync(imageList);

        if (result) succeded = await SaveImages(imageList);

        return succeded ? residence.Id : Guid.Empty;
    }

    public async Task<bool> UpdateResidence(Guid id,ResidenceRequest request, IFormFileCollection updatedImages,List<string> imagesToDelete)
    {
        var residence = await _ctx.Residences.FirstOrDefaultAsync(x => x.Id == id);
        var succeded = false;
        var affectedRows = 0;
        if (residence != null)
        {
            residence.Title = request.Title;
            residence.Description = request.Description;
            residence.Category = request.Category;
            residence.Address = request.Address;
            residence.City = request.City;
            residence.Country = request.Country;
            residence.ZipCode = request.ZipCode;
            residence.OwnerName = request.OwnerName;
            residence.Email = request.Email;
            residence.Phone = request.Phone;
            residence.Price = request.Price;
            
            _ctx.Entry(residence).State = EntityState.Modified;
            affectedRows = await _ctx.SaveChangesAsync();

            if (imagesToDelete.Count > 0)
            {
                foreach (var img in imagesToDelete)
                {
                    await DeleteImage(img);
                }
            }

            if (updatedImages.Count > 0)
            {
                //var imageList = TransformImages(residence, updatedImages);
                var imageList = TransformAzureImages(residence, updatedImages);

                //var result = await _amazonS3Service.UploadImagesAsync(imageList);
                var result = await _azureService.UploadImagesAsync(imageList);

                if (result) succeded = await SaveImages(imageList);
            }
        }

        return succeded || affectedRows > 0;
    }

    public async Task<bool> SaveImages(IEnumerable<ResidenceImages> imagesList)
    {
        var result = 0;
        foreach (var image in imagesList)
        {
            await _ctx.ResidenceImages.AddAsync(image);
            result = await _ctx.SaveChangesAsync();
        }
        return result >= 1;
    }

    public async Task<bool> DeleteImage(string key)
    {
        // AMAZON S3
        /*var result = await _amazonS3Service.DeleteImagesAsync(new List<KeyVersion>
        {
            new()
            {
                Key = key
            }
        });*/
        
        // Azure Key Split
        var blob = key.Split("/").Skip(5).Take(1).First();
        Console.WriteLine(blob);

        // AZURE BLOB STORAGE
        await _azureService.DeleteBlobAsync(blob);
        
        var image = await _ctx.ResidenceImages.FirstOrDefaultAsync(x => x.Url == key);
        var rowsAffected = 0;
        if (image != null)
        {
            _ctx.ResidenceImages.Remove(image);
            rowsAffected = await _ctx.SaveChangesAsync();
        }
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteResidence(Residence residence)
    {
        var residenceImages = await _ctx.ResidenceImages.Where(x => x.ResidenceId == residence.Id)
            .ToListAsync();
        var blobs = residenceImages.Select(image => image.Key);
        //var keys = residenceImages.Select(image => new KeyVersion {Key = image.Key}).ToList();
        // var result = await _amazonS3Service.DeleteImagesAsync(keys);
        foreach (var blob in blobs)
        {
            await _azureService.DeleteBlobAsync(blob);
        }
        /*if (result != null && result.HttpStatusCode != HttpStatusCode.OK)
            return false;*/
        _ctx.ResidenceImages.RemoveRange(residenceImages);
        _ctx.Residences.Remove(residence);
        var nr = await _ctx.SaveChangesAsync();
        return nr > 0;
    }

    public List<ResidenceImages> TransformImages(Residence residence,IFormFileCollection images)
    {
        return images
            .Select(image => new ResidenceImages
            {
                ResidenceId = residence.Id,
                CreatedAt = DateTime.Now,
                Key = $"images/{residence.Id}-{image.FileName}",
                Url = $"https://{_s3.BucketName}.s3.{_s3.Region}.amazonaws.com/images/{residence.Id}-{image.FileName}",
                Image = image
            })
            .ToList(); 
    }
    
    private static IEnumerable<ResidenceImages> TransformAzureImages(Residence residence,IFormFileCollection images)
    {
        return images
            .Select(image => new ResidenceImages
            {
                ResidenceId = residence.Id,
                CreatedAt = DateTime.Now,
                Key = $"{residence.Id}-{image.FileName}",
                Url = $"http://127.0.0.1:10000/devstoreaccount1/ushtrime/{residence.Id}-{image.FileName}",
                Image = image
            })
            .ToList(); 
    }
}