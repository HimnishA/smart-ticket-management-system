using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            throw new UnauthorizedAccessException("UserId claim missing");

        return int.Parse(userIdClaim.Value);
    }

    // ✅ ADD THIS
    public static string GetUserRole(this ClaimsPrincipal user)
    {
        var roleClaim = user.FindFirst(ClaimTypes.Role);

        if (roleClaim == null)
            throw new UnauthorizedAccessException("Role claim missing");

        return roleClaim.Value;
    }
}
