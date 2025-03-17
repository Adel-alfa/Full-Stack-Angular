using System.ComponentModel.DataAnnotations;

namespace angularNet9.API.DTOs
{
    public class ResetPasswordRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
