
using angularNet9.API.DTOs;
using angularNet9.API.Models;

namespace angularNet9.API.Repositories
{

    public interface ICategory
    {
        Task<ServiceResponse<int>> AddCategory(CreateCategoryDto model);
        Task<ServiceResponse<List<Category>>> GetAllCategories();
    }
}