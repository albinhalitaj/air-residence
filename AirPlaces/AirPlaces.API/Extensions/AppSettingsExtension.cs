using AirPlaces.API.AppSettings;

namespace AirPlaces.API.Extensions;

public static class AppSettingsExtension
{
    public static void AddAppSettings(this IServiceCollection services, IConfiguration configuration)
    {
        var appSettingsSection = configuration.GetSection("ApplicationSettings");
        var s3SettingsSection = configuration.GetSection("S3Settings");
        services.Configure<ApplicationSettings>(appSettingsSection);
        services.Configure<S3Settings>(s3SettingsSection);
    }
    
}