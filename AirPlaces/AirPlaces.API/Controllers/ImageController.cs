using AirPlaces.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AirPlaces.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImageController : ControllerBase
{
    private readonly IResidenceService _residenceService;
    private readonly IAmazonS3Service _amazonS3Service;
    private readonly IAzureService _azureService;

    public ImageController(IResidenceService residenceService,IAmazonS3Service amazonS3Service,IAzureService azureService)
    {
        _residenceService = residenceService;
        _amazonS3Service = amazonS3Service;
        _azureService = azureService;
    }
    
    [HttpDelete]
    [Route(nameof(DeleteImage))]
    public async Task<IActionResult> DeleteImage([FromBody] DeleteImageRequest request)
    {
        if (string.IsNullOrEmpty(request.Key))
        {
            return BadRequest();
        }

        var result = await _residenceService.DeleteImage(request.Key);
        return result ? NoContent() : BadRequest();
    }

    [HttpGet]
    [Route(nameof(GetImages))]
    public async Task<IActionResult> GetImages([FromQuery] string key)
    {
        var memoryStream = new MemoryStream();
        //var resp = await _amazonS3Service.GetImage(key);
        //var stream = resp.ResponseStream;
        var resp = await _azureService.GetBlobAsync(key);
        var stream = resp.Content;
        await stream.CopyToAsync(memoryStream);
        memoryStream.Position = 0;
        var name = key[..38];
        //AWS
        /*
        return new FileStreamResult(memoryStream, resp.Headers["Content-Type"])
        {
            FileDownloadName = key
        };
         */
        return new FileStreamResult(memoryStream, resp.ContentType)
        {
            FileDownloadName = name
        };
    }
}

public record DeleteImageRequest(string Key);