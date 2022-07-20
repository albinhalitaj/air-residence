using AirPlaces.API.DTOs;
using AirPlaces.Entities.Models;

namespace AirPlaces.API.Extensions;

public static class AsDtoExtension
{
    public static ResidenceResponse AsDto(this Residence residence)
    {
        return new ResidenceResponse(residence.Id, residence.Title, residence.Description, residence.Category
            ,residence.Address, residence.City, residence.Country,
            residence.ZipCode, residence.OwnerName, residence.Email,
            residence.Phone, residence.Price,residence.Images);
    }
}