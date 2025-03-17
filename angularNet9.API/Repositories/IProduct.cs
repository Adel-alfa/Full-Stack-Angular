using angularNet9.API.DTOs;
using angularNet9.API.Models;

namespace angularNet9.API.Repositories
{
    public interface IProduct
    {
        Task<ServiceResponse<int>> AddProduct(Product model);
        Task<List<Product>> GetAllProducts();
    }
}