using System.Net;

namespace AirPlaces.API.ApiExtensions;

public static partial class Result
{
    public static Result<T> Success<T>(this T value) => new Result<T>(value, HttpStatusCode.Accepted);
    public static Result<T> Success<T>(this T value, HttpStatusCode httpStatusCode) => new Result<T>(value, httpStatusCode);
}