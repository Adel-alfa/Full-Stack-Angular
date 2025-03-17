using Microsoft.AspNetCore.Mvc;
using angularNet9.API.Repositories;
using angularNet9.API.Models;

namespace angularNet9.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController (IProduct productService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> AddProduct( Product model)
        {
            var response = await productService.AddProduct(model);

            if (response.Success)
            {
                return Ok(response);
            }

            return BadRequest(response);
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await productService.GetAllProducts();
           
            return Ok(products);
        }

        
    }
}
