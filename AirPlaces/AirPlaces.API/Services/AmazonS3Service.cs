using System.Net;
using AirPlaces.API.AppSettings;
using AirPlaces.API.Interfaces;
using AirPlaces.Entities.Models;
using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;

namespace AirPlaces.API.Services;

public class AmazonS3Service : IAmazonS3Service
{
    private readonly S3Settings _s3Settings;
    private readonly AmazonS3Client _amazonS3Client;
    
    public AmazonS3Service(IOptions<S3Settings> s3Settings)
    {
        _s3Settings = s3Settings.Value;
        _amazonS3Client = new AmazonS3Client(RegionEndpoint.EUCentral1);
    }
    
    public async Task<bool> UploadImagesAsync(IEnumerable<ResidenceImages> imagesList)
    {
        var result = false;
        foreach (var uploadImageRequest in imagesList.Select(image => new PutObjectRequest
                 {
                     Key = image.Key,
                     BucketName = _s3Settings.BucketName,
                     InputStream = image.Image.OpenReadStream(),
                     ContentType = image.Image.ContentType
                 }))
        {
            try
            {
                var response = await _amazonS3Client.PutObjectAsync(uploadImageRequest,CancellationToken.None);
                if (response.HttpStatusCode == HttpStatusCode.OK) result = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
        return result;
    }

    public async Task<DeleteObjectsResponse?> DeleteImagesAsync(List<KeyVersion> keyNames)
    {
        try
        {
            var request = new DeleteObjectsRequest
            {
                BucketName = _s3Settings.BucketName,
                Objects = keyNames
            };
            var resp = await _amazonS3Client.DeleteObjectsAsync(request);

            return resp;
        }
        catch (AmazonS3Exception e)
        {
            return new DeleteObjectsResponse
            {
                DeleteErrors = new List<DeleteError>
                {
                    new()
                    {
                        Message = $"Error While Deleting Image: ${e.Message}"
                    }
                } 
            };
        }
    }

    public async Task<GetObjectResponse> GetImage(string keyName)
    {
        var request = new GetObjectRequest
        {
            BucketName = _s3Settings.BucketName,
            Key = keyName
        };
        var response = await _amazonS3Client.GetObjectAsync(request);
        return response;
    }
}