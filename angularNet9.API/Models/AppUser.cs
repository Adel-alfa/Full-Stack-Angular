using Microsoft.AspNetCore.Identity;

namespace angularNet9.API.Models
{
    public class AppUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiredDate { get; set; } = DateTime.Now.AddDays(1);
        public bool isActive { get; set; } = false;
    }
}
