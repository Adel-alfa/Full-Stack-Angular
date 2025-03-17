using angularNet9.API.Data;
using angularNet9.API.DTOs;
using angularNet9.API.Models;
using Microsoft.EntityFrameworkCore;

namespace angularNet9.API.Repositories
{
    public class CategoryRepository : ICategory
    {
        
        private readonly AppDbContext appDbContext;

        public CategoryRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }
      
        public async Task<ServiceResponse<int>> AddCategory(CreateCategoryDto model)
        {
            var response = new ServiceResponse<int>();

            if (model == null)
            {
                response.Success = false;
                response.Message = "Model is null!";
                response.Data = default(int);
                return response;
            }
            try
            {
                var (isValid, message) = await CheckName(model.Name!);
                if (isValid)
                {
                    var category = new Category{
                        Name = model.Name,
                    };
                    appDbContext.Categories.Add(category);
                    await Commit();

                    response.Success = true;
                    response.Message = "Category saved successfully.";
                    response.Data = category.Id;
                }
                else
                {
                    response.Success = false;
                    response.Message = message;
                    response.Data = default(int);
                }

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
                response.Data = default(int);
            }
            
            return response;
        }
        
        public async Task<ServiceResponse<List<Category>>> GetAllCategories()
        {
            var response = new ServiceResponse<List<Category>>();

            try
            {                
                var categories = await appDbContext.Categories.ToListAsync();

                response.Success = true;
                response.Message = "Categories retrieved successfully.";
                response.Data = categories;
            }
            catch (Exception ex)
            {                
                response.Success = false;
                response.Message = $"An error occurred: {ex.Message}";
                response.Data = null;
            }

            return response;
}


        

        public async Task<(bool isValid, string message)> CheckName(string name)
        {           
           
            if (string.IsNullOrWhiteSpace(name))
            {
                return (false, "Name cannot be empty.");
            }

            var existingCategory = await appDbContext.Categories.FirstOrDefaultAsync(_=> _.Name!.ToLower().Equals(name.ToLower()));
            //(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
               
            return existingCategory is null ? (true, "Name is valid.") :(false, "Category name already exists.");            
        }

        
        private async Task Commit() => await appDbContext.SaveChangesAsync();

        
    }
}