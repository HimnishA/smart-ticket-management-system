using Application.DTOs.Auth;

namespace Application.Interfaces.Auth;

public interface IAuthService
{
    Task RegisterAsync(RegisterRequestDto dto);

    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
