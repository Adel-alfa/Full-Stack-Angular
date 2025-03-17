namespace angularNet9.API.DTOs
{
    public class RoleAssignDto
    {
        public string UserId { get; set; } = null!;
        public string RoleId { get; set; } = null!;
    }

    public class UpdateUserRolesRequest
    {
        public string UserId { get; set; }
        public string[] Roles { get; set; }
    }
}
