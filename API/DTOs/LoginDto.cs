using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class LoginDto
    {
        public LoginDto(string username, string password) 
        {
            this.Username = username;
            this.password = password;
   
        }

        [Required]
        public string Username { get; set; }
        [Required]
        public string password { get; set; }
    }
}