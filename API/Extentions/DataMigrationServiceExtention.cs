using API.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Extentions
{
    public static class DataMigrationServiceExtention
    {
        public static WebApplication MigrateDatabase(this WebApplication services, WebApplication host)
        {
            using var scope = host.Services.CreateScope();
            var service = scope.ServiceProvider;
            try
            {
                var context = service.GetRequiredService<DataContext>();
                context.Database.MigrateAsync();
                seed.seedUser(context);
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