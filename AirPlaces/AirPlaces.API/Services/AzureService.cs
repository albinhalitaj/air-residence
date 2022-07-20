using System.Net;
using AirPlaces.API.Extensions;
using AirPlaces.API.Interfaces;
using AirPlaces.Entities.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace AirPlaces.API.Services;

public class AzureService : IAzureService
{
    private readonly BlobServiceClient _blobServiceClient;
    private readonly BlobContainerClient _blobContainerClient;

    public AzureService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
        _blobContainerClient = _blobServiceClient.GetBlobContainerClient("ushtrime");
    }
    
    public async Task<bool> UploadImagesAsync(IEnumerable<ResidenceImages> imagesList)
    {
        var result = false;
        foreach (var image in imagesList)
            result = await UploadImage(image.Key, image.Image.OpenReadStream());
        return result;
    }

    private async Task<bool> UploadImage(string fileName, Stream? content)
    {
        bool result;
        try
        {
            var blobClient = _blobContainerClient.GetBlobClient(fileName);
            var resp = await blobClient.UploadAsync(content, new BlobHttpHeaders {ContentType = fileName.GetContentType()});
            result = resp.GetRawResponse().Status == (int) HttpStatusCode.Created;
        }
        catch (Exception)
        {
            result = false;
        }
        return result;
    }

    public async Task DeleteBlobAsync(string blobName)
    {
        if (string.IsNullOrEmpty(blobName))
            return;
        var blobClient = _blobContainerClient.GetBlobClient(blobName);
        await blobClient.DeleteIfExistsAsync();
    }

    public async Task<BlobDownloadInfo> GetBlobAsync(string name)
    {
        var blob = _blobContainerClient.GetBlobClient(name);
        var downloadInfo = await blob.DownloadAsync();
        return downloadInfo;
    }
}