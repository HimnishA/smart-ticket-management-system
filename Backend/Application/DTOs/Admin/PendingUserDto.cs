namespace Application.DTOs.Admin;

public class PendingUserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public bool IsApproved { get; set; }
}
