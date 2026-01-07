using Application.DTOs.Admin;
using Application.Interfaces.Admin;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Admin;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly ApplicationDbContext _context;

    public AdminDashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdminDashboardDto> GetAdminDashboardAsync()
    {
        return new AdminDashboardDto
        {
            // Users
            TotalUsers = await _context.Users.CountAsync(),
            PendingUserApprovals = await _context.Users.CountAsync(u => !u.IsApproved),

            // Categories
            ActiveCategories = await _context.TicketCategories.CountAsync(c => c.IsActive),
            InactiveCategories = await _context.TicketCategories.CountAsync(c => !c.IsActive),

            // Priorities
            ActivePriorities = await _context.TicketPriorities.CountAsync(p => p.IsActive),
            InactivePriorities = await _context.TicketPriorities.CountAsync(p => !p.IsActive),

            // SLA Policies
            ActiveSlaPolicies = await _context.SLAPolicies.CountAsync(s => s.IsActive),
            InactiveSlaPolicies = await _context.SLAPolicies.CountAsync(s => !s.IsActive)
        };
    }
}
