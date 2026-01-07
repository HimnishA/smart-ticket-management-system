namespace Application.DTOs.SupportManager;

public class AvailableSupportAgentDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
}
