using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class BuggyDto
    {
        public BuggyDto(string Username, string password) 
        {
            this.Username = Username;
            this.Password = password;
   
        }
        [Required]
        public string Username { get; set; }  
        [Required]
        public string Password { get; set; }          
    }
}