using System.Collections.Immutable;
using System.Net;
using Microsoft.AspNetCore.Mvc;

namespace AirPlaces.API.ApiExtensions;

public static class ActionResultExtensions
{
    public static ResultDto<T> Error<T>(this IActionResult action, string error,HttpStatusCode code)
    {
        var response = new ResultDto<T>
        {
            Errors = ImmutableArray.Create(ApiExtensions.Error.Create(error,code))
        };
        return response;
    } 
}