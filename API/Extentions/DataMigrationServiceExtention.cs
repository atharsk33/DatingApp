using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class DataMigrationServiceExtention
    {
        public static async Task<WebApplication> MigrateDatabase(this WebApplication services, WebApplication host)
        {
            using var scope = host.Services.CreateScope();
            var service = scope.ServiceProvider;
            try
            {
                var context = service.GetRequiredService<DataContext>();
                var userManage = service.GetRequiredService<UserManager<AppUser>>();
                var roleManager = service.GetRequiredService<RoleManager<AppRole>>();
                await context.Database.MigrateAsync();
                await seed.seedUser(userManage, roleManager);
                //seed.seedUser(context);
            }
            catch (Exception ex)
            {
                var logger = service.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occured during migration");
            }

            return services;
        }

    }
}