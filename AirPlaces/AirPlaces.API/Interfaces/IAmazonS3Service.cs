using AirPlaces.API.Services;
using AirPlaces.Entities.Models;
using Amazon.S3.Model;

namespace AirPlaces.API.Interfaces;

public interface IAmazonS3Service
{
    Task<bool> UploadImagesAsync(IEnumerable<ResidenceImages> imagesList);
    Task<DeleteObjectsResponse?> DeleteImagesAsync(List<KeyVersion> keyNames);
    Task<GetObjectResponse> GetImage(string keyName);
}