using AirPlaces.API.DTOs;

namespace AirPlaces.API.Interfaces;

public interface IIdentityService
{
   Task<LoginResponse?> LoginUser(LoginModel model);
}