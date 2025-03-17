using angularNet9.API.Data.Migrations;
using angularNet9.API.DTOs;
using angularNet9.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;
using MimeKit;
using MailKit.Net.Smtp;
using System.Text.Json.Serialization;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Net;

namespace angularNet9.API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        public AccountController(UserManager<AppUser> userManager,
                     RoleManager<IdentityRole> roleManager,
                     IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = new AppUser
            {
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                UserName = registerDto.Email,
            };
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            if (registerDto.Roles is null)
            {
                await _userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                foreach (var role in registerDto.Roles)
                {
                    await _userManager.AddToRoleAsync(user, role);
                }
            }
            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Account Successfuly Created!",
            });
        }

        [HttpPost("UpdateStatus")]
        public async Task<ActionResult> UpdataUserStatus(UpdateUserStatusDto statusDto)
        {
            //var user = await _userManager.FindByEmailAsync(statusDto.Email);

            var user =  await _userManager.FindByIdAsync(statusDto.userId);
            if (user == null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User Email not exist!",

                });
            }
            user.isActive = statusDto.status;

            var res = await _userManager.UpdateAsync(user);

            return Ok(new { message = "User status updated successfully." });
        }
        [HttpPost("Login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User Email not exist!",

                });
            }
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result)
            {
                return Unauthorized(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid Password!",

                });
            }
            var token = await GenerateTokenString(user);
            var refreshToken =  GenerateRefreshToken();
            _= int.TryParse(_configuration.GetSection("Jwt").GetSection("RefreshTokenValidityInMinutes").Value, out int RefreshTokenValidityInMinutes);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiredDate = DateTime.UtcNow.AddMinutes(RefreshTokenValidityInMinutes);
            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Logint Success!",
                Token = token,
                RefreshToken= refreshToken
            });
        }
        //getbyid? id

        [Authorize]
        [HttpGet("getbyid/{id}")]
        public async Task<ActionResult<AspUserDetailsDto>> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist"
                });
            }
            return Ok(new AspUserDetailsDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Roles = [.. await _userManager.GetRolesAsync(user)],
                PhoneNumber = user.PhoneNumber,
                EmailConfirmed = user.EmailConfirmed,
                AccessFailedCount = user.AccessFailedCount,
                status= user.isActive,

            });
        }
        [Authorize]
        [HttpGet("details")]
        public async Task<ActionResult<AspUserDetailsDto>> GetAspUserDetail()
        {
            var authenticated_userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userManager.FindByIdAsync(authenticated_userid!);
            if (user == null)
            {
                return NotFound(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist"
                });
            }
            return Ok(new AspUserDetailsDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Roles = [.. await _userManager.GetRolesAsync(user)],
                PhoneNumber = user.PhoneNumber,
                EmailConfirmed = user.EmailConfirmed,
                AccessFailedCount = user.AccessFailedCount,

            });
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AspUserDetailsDto>>> GetUsers()
        {
            var users = await  _userManager.Users.Select(u => new AspUserDetailsDto
            {
                Id = u.Id,
                Email = u.Email,
                FullName = u.FullName,
                status = u.isActive,
                Roles = _userManager.GetRolesAsync(u).Result.ToArray()
            }).ToListAsync();           

            return Ok(users);
        }
        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePasswor(ChangePasswordDto changeDto)
        {
            var user = await _userManager.FindByEmailAsync(changeDto.Email);
            if (user == null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist"
                });
            }
            var res = await _userManager.ChangePasswordAsync(user, changeDto.CurrentPassword, changeDto.NewPassword);
            if (res.Succeeded)
            {
                return Ok(new AuthResponseDto
                {
                    IsSuccess = true,
                    Message = "Password has been changed successfully."
                });
            }
            else
            {
                var error = res.Errors.FirstOrDefault();
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = error!.Description
                });
            }
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthResponseDto>> RefreshToken(TokenDto tokenDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get claims principal from the token
            var principal = GetPrencipalFromToken(tokenDto.Token);
            var user = await _userManager.FindByEmailAsync(tokenDto.Email!);

            // Validate token and user details
            if (principal is null || user is null||user.RefreshToken != tokenDto.RefreshToken || user.RefreshTokenExpiredDate <= DateTime.UtcNow)
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid request"
                });
            // Generate new JWT token and refresh token
            var newJwtToken = await GenerateTokenString(user);
            var newRefreshToken = GenerateRefreshToken();

            // Get the refresh token validity period from the configuration
            _ = int.TryParse(_configuration.GetSection("Jwt:RefreshTokenValidityInMinutes").Value, out int RefreshTokenValidityInMinutes);

            // Update user refresh token and expiry date
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiredDate = DateTime.UtcNow.AddMinutes(RefreshTokenValidityInMinutes);
            await _userManager.UpdateAsync(user);

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Token Refreshed Successfully!",
                Token = newJwtToken,
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ResetPasswordRequestDto request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist"
                });
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            //var resetLink = Url.Action("ResetPassword", "Account", new { token, email = user.Email }, Request.Scheme);
            // token={WebUtility.urlEncode(token)}
            var resetLink = $"http://localhost:4200/reset-password?token={token}&email={user.Email}";

            // Send email
            await SendResetPasswordEmail(user.Email!, user.FullName! ,resetLink!);

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Password reset link sent. Please check your email"
            });
        }
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword(ResetPasswordDto restPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(restPasswordDto.Email);
            // for api test             
            //restPasswordDto.Token = WebUtility.UrlDecode(restPasswordDto.Token);
            
            // webutility  %20 space +
            restPasswordDto.Token = restPasswordDto.Token.Replace(" ", "+");

            if (user == null)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "User does not exist"
                });
            }
            var result = await _userManager.ResetPasswordAsync(user, restPasswordDto.Token, restPasswordDto.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid token or password."
                });                
            }

            return Ok(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Password has been reset successfully."
            });           
        }
        private ClaimsPrincipal GetPrencipalFromToken(string? token)
        {

            if (token is null)
                throw new ArgumentNullException(nameof(token), "Token should not be null");

            var tokenKey = _configuration.GetSection("Jwt:Key").Value;

            if (string.IsNullOrEmpty(tokenKey))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
                ValidateLifetime = false, // For testing; set to 'true' in production
            };
            var securityTokenHandler = new JwtSecurityTokenHandler();
            var principal = securityTokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal;
        }

        private async Task<string> GenerateTokenString(AppUser user)
        {
            var claims = await GetClaims(user);
            var Key = Encoding.ASCII.GetBytes(_configuration.GetSection("Jwt").GetSection("Key").Value!);

            var securityKey = new SymmetricSecurityKey(Key);

            var signingCred = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
            var expiryInDay = DateTime.Now.AddMinutes(60);

            var TokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiryInDay,
                //Issuer = _configuration.GetSection("Jwt").GetSection("Issuer").Value!,
                //Audience = _configuration.GetSection("Jwt").GetSection("Audience").Value!,
                SigningCredentials = signingCred
            };

            var securityTokenHandler = new JwtSecurityTokenHandler();
            var securityToken = securityTokenHandler.CreateToken(TokenDescriptor);
            var tokenString = securityTokenHandler.WriteToken(securityToken);
            return tokenString;
        }
        private async Task<List<Claim>> GetClaims(AppUser user)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Name, user.FullName?? ""),
                new Claim(JwtRegisteredClaimNames.Email , user.Email!),
                new Claim(JwtRegisteredClaimNames.NameId , user.Id),
                new Claim(JwtRegisteredClaimNames.Aud, _configuration.GetSection("Jwt").GetSection("Audience").Value!),
                new Claim(JwtRegisteredClaimNames.Iss, _configuration.GetSection("Jwt").GetSection("Issuer").Value!),
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));

            }
            return claims;
        }
        
        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }
        private async Task SendResetPasswordEmail(string email,string name, string resetLink)
        {
            var message = new MimeMessage();

            // Ethereal is a fake SMTP service https://ethereal.email/
            // https://ethereal.email/create for create fake email for testing
            // you need to change name , email and password

            string testUserName  = "Angelina Crona";
            string testUserEmail = "angelina88@ethereal.email";
            string testUserPassword = "SbjYf1FgHHM1KU2w4A";

            message.From.Add(new MailboxAddress(testUserName, testUserEmail));
            message.To.Add(MailboxAddress.Parse(testUserEmail));
            message.Subject = "Password Reset";
           

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
                <html>
                <body>
                    <p>Hello {name},</p>
                    <p>We have sent you this email in response to your request to reset your password on AlfaOne.</p>
                    <p>To reset your password, please click the button below:</p>
                    <a href='{resetLink}' style='display: inline-block; padding: 10px 20px; margin-left: 50px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;'>Reset Password</a>
                    <p>This password link is only valid for the next 24 hours.</p>
                    <p>Please ignore this email if you did not request a password change.</p>
                    <p>Best Regards,<br/>AlfaOne company</p>
                </body>
                </html>";           

            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new MailKit.Net.Smtp.SmtpClient())
            {
                await client.ConnectAsync("smtp.ethereal.email", 587, false);
                await client.AuthenticateAsync(testUserEmail, testUserPassword);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }

    }
}