using Domain.Entities;

namespace Application.Interfaces.Security;

public interface IJwtTokenService
{
    string GenerateToken(User user, IEnumerable<string> roles);
}
