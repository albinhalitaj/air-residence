using Microsoft.AspNetCore.Mvc;

namespace AirPlaces.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{

    [Route(nameof(GetUsers))]
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        return Ok("test");
    }

    [Route(nameof(AddUser))]
    [HttpPost]
    public async Task<IActionResult> AddUser()
    {
        return NoContent();
    }
}