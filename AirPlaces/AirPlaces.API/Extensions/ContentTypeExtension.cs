using Microsoft.AspNetCore.StaticFiles;

namespace AirPlaces.API.Extensions;

public static class ContentTypeExtension
{
    private static readonly FileExtensionContentTypeProvider provider = new();
    public static string GetContentType(this string key)
    {
        if (!provider.TryGetContentType(key,out var contentType))
        {
            contentType = "application/octet-stream";
        }
        return contentType;
    }
}