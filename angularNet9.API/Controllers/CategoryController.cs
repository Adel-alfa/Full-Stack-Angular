using Microsoft.AspNetCore.Mvc;
using angularNet9.API.Repositories;
using angularNet9.API.DTOs;


namespace angularNet9.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController (ICategory categoryService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> AddCategory( CreateCategoryDto model)
        {
            var response = await categoryService.AddCategory(model);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var response = await categoryService.GetAllCategories();

            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        
    }
}
