﻿using System.ComponentModel.DataAnnotations;

namespace angularNet9.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } =string.Empty;

        public string FullName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public List<string>? Roles { get; set; }
    }
}
