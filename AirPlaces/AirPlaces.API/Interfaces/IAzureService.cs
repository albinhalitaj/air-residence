using AirPlaces.Entities.Models;
using Azure.Storage.Blobs.Models;

namespace AirPlaces.API.Interfaces;

public interface IAzureService
{
    Task<bool> UploadImagesAsync(IEnumerable<ResidenceImages> imagesList);
    Task DeleteBlobAsync(string blobName);
    Task<BlobDownloadInfo> GetBlobAsync(string name);
}