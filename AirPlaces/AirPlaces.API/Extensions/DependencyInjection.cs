using AirPlaces.API.Interfaces;
using AirPlaces.API.Services;
using Azure.Storage.Blobs;

namespace AirPlaces.API.Extensions;

public static class DependencyInjection
{
   public static void RegisterServices(this IServiceCollection services, IConfiguration conf)
   {
      services.AddSingleton(x => new BlobServiceClient(conf.GetValue<string>("AzureBlobStorageConnectionString")));
      services.AddScoped<IIdentityService, IdentityService>();
      services.AddScoped<IResidenceService,ResidenceService>();
      services.AddScoped<IAmazonS3Service,AmazonS3Service>();
      services.AddScoped<IAzureService, AzureService>();
   } 
}