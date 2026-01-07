namespace Application.DTOs.Admin;

public class ApproveUserRequestDto
{
    public List<int> RoleIds { get; set; } = new();
}
