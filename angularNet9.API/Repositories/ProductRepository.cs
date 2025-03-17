

using angularNet9.API.Data;
using angularNet9.API.DTOs;
using angularNet9.API.Models;
using Microsoft.EntityFrameworkCore;

namespace angularNet9.API.Repositories{
    public class ProductRepository : IProduct
    {
        private readonly AppDbContext appDbContext;

        public ProductRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }
      
        public async Task<ServiceResponse<int>> AddProduct(Product model)
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
                    appDbContext.Products.Add(model);
                    await Commit();

                    response.Success = true;
                    response.Message = "Product saved successfully.";
                    response.Data = model.Id;
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

        public async Task<List<Product>> GetAllProducts()=> await appDbContext.Products.ToListAsync();
        
         private async Task Commit() => await appDbContext.SaveChangesAsync();
        public async Task<(bool isValid, string message)> CheckName(string name)
        {           
           
            if (string.IsNullOrWhiteSpace(name))
            {
                return (false, "Name cannot be empty.");
            }

            var existingCategory = await appDbContext.Products.FirstOrDefaultAsync(_=> _.Name!.ToLower().Equals(name.ToLower()));;
               
            return existingCategory is null ? (true, "Name is valid.") :(false, "Product name already exists.");            
        }
    }
}