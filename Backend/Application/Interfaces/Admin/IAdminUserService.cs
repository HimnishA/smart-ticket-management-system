using Application.DTOs.Admin;

namespace Application.Interfaces.Admin;

public interface IAdminUserService
{
    Task<IEnumerable<PendingUserDto>> GetPendingUsersAsync();
    Task ApproveUserAsync(int userId, IEnumerable<int> roleIds, int adminUserId);
    Task RejectUserAsync(int userId, int adminUserId);
}
