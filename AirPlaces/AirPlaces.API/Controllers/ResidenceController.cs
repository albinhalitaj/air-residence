using System.Collections.Immutable;
using System.Net;
using System.Text.Json;
using AirPlaces.API.ApiExtensions;
using AirPlaces.API.DTOs;
using AirPlaces.API.Extensions;
using AirPlaces.API.Interfaces;
using AirPlaces.Entities;
using AirPlaces.Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static AirPlaces.API.Extensions.RequestExtension;

namespace AirPlaces.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ResidenceController : ControllerBase
{
    private readonly ApplicationContext _ctx;
    private readonly IResidenceService _residenceService;

    public ResidenceController(ApplicationContext ctx,IResidenceService residenceService)
    {
        _ctx = ctx;
        _residenceService = residenceService;
    }
    
    [HttpGet]
    public async Task<ActionResult<List<ResidenceResponse>>> GetResidences()
    {
        var response = new ResultDto<List<ResidenceResponse>>();
        var residences = await _ctx.Residences.Include(x=>x.Images)
            .Select(x=> x.AsDto())
            .ToListAsync();
        response.Value = residences;
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetResidence(Guid id)
    {
        var response = new ResultDto<Residence>();
        var residence = await _ctx.Residences.Include(x=>x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);
        if (residence == null)
        {
            response.Errors = ImmutableArray.Create(Error.Create($"Residence {id} was not found",HttpStatusCode.NotFound));
            return NotFound(response);
        }
        response.Value = residence;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddResidence()
    {
        var response = new ResultDto<Residence>();
        if (!HttpContext.Request.HasFormContentType || HttpContext.Request.Form.Files.Count < 1)
        {
            response.Errors = ImmutableArray.Create(Error.Create("Please fill the form, and upload at least one file",HttpStatusCode.BadRequest));
            return BadRequest(response);
        }

        var (formFileCollection, residenceRequest, _) = HttpContext.GetRequestParameters(RequestMethod.Post);
        var id = await _residenceService.AddResidence(residenceRequest, formFileCollection);
        if (string.IsNullOrEmpty(id.ToString()))
        {
            response.Errors = ImmutableArray.Create(Error.Create("Insert failed",HttpStatusCode.InternalServerError));
            return BadRequest(response);
        }
        var res = await _ctx.Residences.Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);
        return CreatedAtAction(nameof(GetResidence), new {id},residenceRequest);
    }

    
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateResidence(Guid id)
    {
        if (!HttpContext.Request.HasFormContentType)
            return BadRequest(new
            {
                Message = "Validation Error! Please upload images and all the fields!"
            });

        var (files, request, imagesToDelete) = HttpContext.GetRequestParameters(RequestMethod.Put);
        
        var residenceUpdated = await _ctx.Residences.Include(x => x.Images).Where(x => x.Id == id).FirstOrDefaultAsync();
        var result = imagesToDelete != null && await _residenceService.UpdateResidence(id, request, files,imagesToDelete);

        return result ? CreatedAtAction(nameof(GetResidence), new {id},residenceUpdated) : BadRequest();
    }

    [HttpGet]
    [Route(nameof(GetImage))]
    public async Task<IActionResult> GetImage(string keyName)
    {
        return Ok();
    }


    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteResidence(Guid id)
    {
        var response = new ResultDto<string>();
        var residence = await _ctx.Residences.FirstOrDefaultAsync(x => x.Id == id);
        if (residence is null)
        {
            response.Errors = ImmutableArray.Create(Error.Create($"Residence {id} was not found",HttpStatusCode.NotFound));
            return NotFound(response);
        }
        var result = await _residenceService.DeleteResidence(residence);
        if (result)
        {
            response.Value = $"Residence {id} was deleted successfully!";
            return Ok(response);
        }
        response.Errors = ImmutableArray.Create(Error.Create($"Internal Server Error",HttpStatusCode.InternalServerError));
        return BadRequest(response);
    }
}