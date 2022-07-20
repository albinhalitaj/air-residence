using System.ComponentModel.DataAnnotations;
using AirPlaces.Entities.Models;
using Microsoft.AspNetCore.Mvc;

namespace AirPlaces.API.DTOs;

public record ResidenceResponse(Guid Id,string Title,string Description, string Category, string Address,
 string City, string Country, string ZipCode, string OwnerName, string Email, string Phone,decimal Price,List<ResidenceImages> Images);
public record ResidenceRequest( string Title,
     string Description,  string Category, string Address,
     string City, string Country, string ZipCode,
     string OwnerName, string Email, string Phone,
     decimal Price);
public record UpdateResidenceRequest( Guid Id, string Title,
 string Description,  string Category, string Address,
 string City, string Country, string ZipCode,
 string OwnerName, string Email, string Phone,
 decimal Price);

