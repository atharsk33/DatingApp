using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Service;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class ApplicationServiceExtention
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<CloudinarySetting>(config.GetSection("CloudinarySetting"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoservice, PhotoService>();
            services.AddScoped<LogUserActivity>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>(options => {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
                });

                return services;
        }
        
    }
}