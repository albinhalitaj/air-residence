using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Common;
using Microsoft.AspNetCore.Http;

namespace AirPlaces.Entities.Models;

public class ResidenceImages : EntityBase
{
    public int Id { get; set; }
    public Guid ResidenceId { get; set; }
    public string Key { get; set; }
    public string Url { get; set; }
    
    [NotMapped]
    public IFormFile Image { get; set; }
}