using System.ComponentModel.DataAnnotations;

namespace angularNet9.API.DTOs
{
    public class CreateRoleDto
    {
        [Required(ErrorMessage = "Role Name is required.")]
        public string RoleName { get; set; } = null!;
    }
}
