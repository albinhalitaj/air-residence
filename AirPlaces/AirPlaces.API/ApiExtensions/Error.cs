using System.Net;

namespace AirPlaces.API.ApiExtensions;

public class Error
{
    public readonly string Message;
    public readonly Guid? ErrorCode;

    private Error(string message, Guid? errorCode)
    {
        Message = message;
        ErrorCode = errorCode;
    }

    public static ErrorDto Create(string message, HttpStatusCode errorCode)
    {
        return new ErrorDto() {Message = message,ErrorCode = errorCode};
    }
    
}