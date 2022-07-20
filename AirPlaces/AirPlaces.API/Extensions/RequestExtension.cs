using System.Text.Json;
using AirPlaces.API.DTOs;

namespace AirPlaces.API.Extensions;

public static class RequestExtension
{
    public static RequestParameters GetRequestParameters(this HttpContext context, RequestMethod reqMethod)
    {
        var files = context.Request.Form.Files;
        var request = context.Request.Form["request"];
        var residence = JsonSerializer.Deserialize<ResidenceRequest>(request[0],new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });
        if (residence == null) return null;
        if (reqMethod != RequestMethod.Put) return new RequestParameters(files, residence);
        var imagesToDelete = context.Request.Form["deleteImage"].ToList();
        return new RequestParameters(files, residence, imagesToDelete);
    }
    
    public record RequestParameters(IFormFileCollection Files, ResidenceRequest Request, List<string>? ImagesToDelete = null);

    public enum RequestMethod
    {
        Post,
        Put
    }
}