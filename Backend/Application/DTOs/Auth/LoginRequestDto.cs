namespace Application.DTOs.Auth;
public sealed class LoginRequestDto
{
    public string Email { get; init; } = null!;
    public string Password { get; init; } = null!;
}
