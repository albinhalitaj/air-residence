using AirPlaces.API.DTOs;
using AirPlaces.Entities.Models;

namespace AirPlaces.API.Interfaces;

public interface IResidenceService
{
   Task GetResidences();
   Task<Guid> AddResidence(ResidenceRequest request,IFormFileCollection images);
   Task<bool> UpdateResidence(Guid id,ResidenceRequest request, IFormFileCollection updatedImages,List<string> imagesToDelete);
   Task<bool> SaveImages(IEnumerable<ResidenceImages> imagesList);
   Task<bool> DeleteImage(string key);
   Task<bool> DeleteResidence(Residence residence);

   List<ResidenceImages> TransformImages(Residence residence,IFormFileCollection images);
}