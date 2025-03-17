using System.ComponentModel.DataAnnotations;

namespace angularNet9.API.DTOs
{
    public class UpdateUserStatusDto
    {
        [Required]
        public string userId { get; set; } = string.Empty;
        [Required]
        public bool status { get; set; } = false;
    }
}
