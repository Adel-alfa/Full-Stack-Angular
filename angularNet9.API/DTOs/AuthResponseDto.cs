namespace angularNet9.API.DTOs
{
    public class AuthResponseDto
    {
        public string? Token { get; set; } = string.Empty;
        public string? RefreshToken { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }
}
