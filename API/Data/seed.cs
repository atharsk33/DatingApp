using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class seed
    {
        public static void seedUser(DataContext context)
        {
            if(context.Users.Any()) return;

            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();

                user.UserName = user.UserName?.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("pa$$word"));
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);
            }

            context.SaveChanges();
        }
    }
}