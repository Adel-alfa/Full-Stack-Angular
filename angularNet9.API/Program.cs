using angularNet9.API.Data;
using angularNet9.API.Models;
using angularNet9.API.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using System.Text;

namespace angularNet9.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddAuthorization();


            builder.Services.AddOpenApi();

            // Add services to the container.
            var JwtSetting = builder.Configuration.GetSection("Jwt");
            builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("Database")));
           
            builder.Services.AddIdentity<AppUser, IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(op => {
                op.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                op.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                op.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(op => {
                op.SaveToken = true;
                op.RequireHttpsMetadata = false;
                op.TokenValidationParameters = new TokenValidationParameters
                {
                   
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = JwtSetting["Issuer"],
                    ValidAudience = JwtSetting["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtSetting.GetSection("Key").Value!))
                };
            });
            builder.Services.AddControllers();

            builder.Services.AddScoped<ICategory, CategoryRepository>();
            builder.Services.AddScoped<IProduct, ProductRepository>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            if (app.Environment.IsDevelopment())
            {


                //https://localhost:7064/scalar/v1  http://localhost:5200/scalar/v1
                app.MapOpenApi();
                app.MapScalarApiReference();

            }


            app.UseHttpsRedirection();

            app.UseCors(op =>
            {
                op.AllowAnyHeader();
                op.AllowAnyMethod();
                op.AllowAnyOrigin();
            });
            app.UseAuthentication();
            app.UseAuthorization();
            


            app.MapControllers();

            app.Run();
        }
    }
}
