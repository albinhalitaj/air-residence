using AirPlaces.Entities.Models;
using Microsoft.EntityFrameworkCore;

namespace AirPlaces.Entities;

public class ApplicationContext : DbContext
{
    public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
    {
        
    } 
    
    public DbSet<User> Users { get; set; }
    public DbSet<Residence> Residences { get; set; }
    public DbSet<ResidenceImages> ResidenceImages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = Guid.NewGuid(),
                Name = "Albin",
                Surname = "Halitaj",
                Email = "albin.halitaj@gmail.com",
                Username = "albik",
                IsActive = true,
                CreatedAt = DateTime.Now,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("albinhalitaj1")
            });
    }
}