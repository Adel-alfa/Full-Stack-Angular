using System.ComponentModel.DataAnnotations;

namespace angularNet9.API.DTOs
{
    public class CreateCategoryDto
    {
        [Required(ErrorMessage = "Category Name is required.")]
        public string Name { get; set; } = null!;
    }
}
