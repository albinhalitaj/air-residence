using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Common;

namespace AirPlaces.Entities.Models;

public class User : EntityBase
{
    [Column("UserId")]
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public bool IsActive { get; set; }
}