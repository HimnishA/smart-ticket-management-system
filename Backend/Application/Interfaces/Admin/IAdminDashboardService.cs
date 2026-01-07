using Application.DTOs.Admin;

namespace Application.Interfaces.Admin;

public interface IAdminDashboardService
{
    Task<AdminDashboardDto> GetAdminDashboardAsync();
}
