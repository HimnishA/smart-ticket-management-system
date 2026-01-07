using Application.DTOs.SupportManager;
using Application.Interfaces.SupportManager;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.SupportManager;

public class SupportAgentLookupService : ISupportAgentLookupService
{
    private readonly ApplicationDbContext _context;

    public SupportAgentLookupService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<AvailableSupportAgentDto>> GetAvailableAgentsAsync()
    {
        return await _context.Users
            .AsNoTracking()
            .Where(u =>
                u.IsActive &&
                u.IsApproved &&
                u.UserRoles.Any(ur => ur.Role.Name == "SupportAgent")
            )
            .OrderBy(u => u.FullName)
            .Select(u => new AvailableSupportAgentDto
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .ToListAsync();
    }
}
