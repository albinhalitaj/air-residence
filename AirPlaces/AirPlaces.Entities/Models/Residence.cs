namespace AirPlaces.Entities.Models;

public class Residence : EntityBase
{
    public Residence()
    {
        Images = new List<ResidenceImages>();
    }
    
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Category { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }
    public string OwnerName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public decimal Price { get; set; }
    
    public virtual List<ResidenceImages> Images { get; set; }
}