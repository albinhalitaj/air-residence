using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AirPlaces.API.AppSettings;
using AirPlaces.API.DTOs;
using AirPlaces.API.Interfaces;
using AirPlaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AirPlaces.API.Services;

public class IdentityService : IIdentityService
{
    private readonly ApplicationContext _ctx;
    private readonly ApplicationSettings _applicationSettings;

    public IdentityService(ApplicationContext ctx,IOptions<ApplicationSettings> applicationSettings)
    {
        _ctx = ctx;
        _applicationSettings = applicationSettings.Value;
    }
    
    public async Task<LoginResponse?> LoginUser(LoginModel model)
    {
        var (username, password) = model;
        var user = await _ctx.Users.FirstOrDefaultAsync(x => x.Username.Equals(username));
        if (user == null)
        {
            return null;
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);

        if (!isPasswordValid)
        {
            return null;
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_applicationSettings.Secret);

        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return new LoginResponse(user.Name,user.Surname,user.Username,user.Email,user.Id.ToString(),tokenHandler.WriteToken(token));
    }
}