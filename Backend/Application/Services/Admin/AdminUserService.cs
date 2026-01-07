using Application.DTOs.Admin;
using Application.Exceptions;
using Application.Interfaces.Admin;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Admin;

public sealed class AdminUserService : IAdminUserService
{
    private readonly ApplicationDbContext _context;

    public AdminUserService(ApplicationDbContext context)
    {
        _context = context;
    }

    // -------------------------
    // GET PENDING USERS
    // -------------------------
    public async Task<IEnumerable<PendingUserDto>> GetPendingUsersAsync()
    {
        return await _context.Users
            .Select(u => new PendingUserDto
            {
                UserId = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                IsApproved = u.IsApproved
            })
            .ToListAsync();
    }

    // -------------------------
    // APPROVE USER
    // -------------------------
    public async Task ApproveUserAsync(
        int userId,
        IEnumerable<int> roleIds,
        int adminUserId)
    {
        if (!roleIds.Any())
            throw new BusinessRuleViolationException(
                "At least one role must be assigned");

        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new BusinessRuleViolationException("User not found");

        if (user.IsApproved)
            throw new BusinessRuleViolationException("User already approved");

        var roles = await _context.Roles
            .Where(r => roleIds.Contains(r.Id))
            .ToListAsync();

        if (roles.Count != roleIds.Count())
            throw new BusinessRuleViolationException("One or more roles are invalid");

        // Assign roles
        foreach (var role in roles)
        {
            user.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            });
        }

        // Approve user
        user.IsApproved = true;
        user.ApprovedAt = DateTime.UtcNow;
        user.ApprovedByUserId = adminUserId;

        await _context.SaveChangesAsync();
    }

    // -------------------------
    // REJECT USER
    // -------------------------
    public async Task RejectUserAsync(int userId, int adminUserId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new BusinessRuleViolationException("User not found");

        if (user.IsApproved)
            throw new BusinessRuleViolationException(
                "Approved users cannot be rejected");

        // Soft rejection
        user.IsActive = false;

        await _context.SaveChangesAsync();
    }
}
