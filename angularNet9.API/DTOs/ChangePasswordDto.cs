﻿using System.ComponentModel.DataAnnotations;

namespace angularNet9.API.DTOs
{
    public class ChangePasswordDto
    {

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;
        [Required]
        public string NewPassword { get; set; } = string.Empty;
    }
}
