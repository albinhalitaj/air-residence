using System.Collections.Immutable;
using System.Net;
using AirPlaces.API.ApiExtensions;
using AirPlaces.API.DTOs;
using AirPlaces.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AirPlaces.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IdentityController : ControllerBase
{
    private readonly IIdentityService _identityService;

    public IdentityController(IIdentityService identityService)
    {
        _identityService = identityService;
    }

    [Route(nameof(Login))]
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var result = await _identityService.LoginUser(model);
        var response = new ResultDto<LoginResponse>();
        if (result != null)
        {
            response.Value = result;
            return Ok(response);
        }
        response.Errors = ImmutableArray.Create(Error.Create("Username or password is invalid",HttpStatusCode.Unauthorized));
        return Unauthorized(response);
    }
}