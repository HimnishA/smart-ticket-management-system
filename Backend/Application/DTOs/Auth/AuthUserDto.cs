namespace Application.DTOs.Auth;

public sealed class AuthUserDto
{
    public int UserId { get; init; }     
    public string Email { get; init; } = null!;
    public IReadOnlyList<string> Roles { get; init; } = [];
}
