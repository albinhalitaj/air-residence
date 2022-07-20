using System.Net;

namespace AirPlaces.API.ApiExtensions;

public class ErrorDto
{
    public string Message { get; set; }
    public HttpStatusCode ErrorCode { get; set; }
}