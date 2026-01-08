using Application.Exceptions;
using Application.Interfaces.SupportManager;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.SupportManager;

public class SupportManagerAssignmentService : ISupportManagerAssignmentService
{
    private readonly ApplicationDbContext _context;

    public SupportManagerAssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AssignTicketAsync(
        int ticketId,
        int assignToUserId,
        int performedByUserId)
    {
        // -------------------------
        // LOAD TICKET
        // -------------------------
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket == null)
            throw new NotFoundException($"Ticket {ticketId} not found.");

        // -------------------------
        // GOVERNANCE RULES
        // -------------------------
        if (ticket.Status == TicketStatus.Closed ||
            ticket.Status == TicketStatus.Cancelled)
        {
            throw new BusinessRuleViolationException(
                "Cannot assign a closed or cancelled ticket.");
        }

        // -------------------------
        // LOAD ASSIGNEE
        // -------------------------
        var assignee = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == assignToUserId);

        if (assignee == null)
            throw new NotFoundException("Assignee not found.");

        if (!assignee.IsActive || !assignee.IsApproved)
            throw new BusinessRuleViolationException(
                "User is not active or approved.");

        var isSupportAgent = assignee.UserRoles
            .Any(r => r.Role.Name == "SupportAgent");

        if (!isSupportAgent)
            throw new BusinessRuleViolationException(
                "User is not a Support Agent.");

        // -------------------------
        // ASSIGNMENT HISTORY
        // -------------------------
        var previousAssigneeId = ticket.AssignedToUserId;

        _context.TicketAssignments.Add(new TicketAssignment
        {
            TicketId = ticket.Id,
            AssignedToUserId = assignToUserId,
            AssignedByUserId = performedByUserId,
            AssignedAt = DateTime.UtcNow
        });

        // -------------------------
        // UPDATE TICKET
        // -------------------------
        ticket.AssignedToUserId = assignToUserId;

        if (ticket.Status == TicketStatus.Created||
            ticket.Status == TicketStatus.Reopened)
            ticket.Status = TicketStatus.Assigned;

        ticket.UpdatedAt = DateTime.UtcNow;

        // -------------------------
        // ACTIVITY LOG
        // -------------------------
        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticket.Id,
            Action = "ASSIGNED",
            FieldName = "AssignedToUserId",
            OldValue = previousAssigneeId?.ToString(),
            NewValue = assignToUserId.ToString(),
            PerformedByUserId = performedByUserId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }
}
