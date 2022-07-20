namespace AirPlaces.API.DTOs;

public record LoginModel(string Username,string Password);
public record LoginResponse(string Name,string Surname,string Username,string Email,string UserId,string Token);