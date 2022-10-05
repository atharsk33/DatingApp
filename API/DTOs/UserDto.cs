using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public UserDto(string username, string token, string photourl) 
        {
            this.Username = username;
            this.Token = token;
            this.PhotoUrl = photourl;
        }
        public string Username { get; set; }
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
    }
}