namespace Application.DTOs.Auth;

public sealed class LoginResponseDto
{
    public string Token { get; init; } = null!;
    public DateTime ExpiresAt { get; init; }
    public AuthUserDto User { get; init; } = null!;
}
