namespace angularNet9.API.DTOs
{
    public class AspUserDetailsDto
    {
        public string? Id { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string[]? Roles { get; set; }
        public string? PhoneNumber { get; set; }
        public bool TwoFacotrEnabled { get; set; }
        public bool EmailConfirmed { get; set; }       
        public int AccessFailedCount { get; set; }
        public bool status { get; set; }
    }
}
