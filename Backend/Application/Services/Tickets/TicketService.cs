using Application.DTOs.Tickets;
using Application.Exceptions;
using Application.Interfaces.Tickets;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Tickets;

public class TicketService : ITicketService
{
    private readonly ApplicationDbContext _context;
    private readonly IAutoAssignmentService _autoAssignmentService;
    private readonly ISlaService _slaService;

    private static readonly Dictionary<TicketStatus, TicketStatus[]> AllowedTransitions =
    new()
    {
        { TicketStatus.Created, new[] { TicketStatus.Assigned, TicketStatus.Cancelled } },
        { TicketStatus.Assigned, new[] { TicketStatus.InProgress, TicketStatus.Cancelled } },
        { TicketStatus.InProgress, new[] { TicketStatus.Resolved, TicketStatus.Cancelled } },
        { TicketStatus.Resolved, new[] { TicketStatus.Closed, TicketStatus.Reopened } },
        { TicketStatus.Closed, new[] { TicketStatus.Reopened } },

        // terminal states
        { TicketStatus.Cancelled, Array.Empty<TicketStatus>() },
        { TicketStatus.Reopened, new[] { TicketStatus.Assigned } }
    };

    public TicketService(
        ApplicationDbContext context,
        IAutoAssignmentService autoAssignmentService,
        ISlaService slaService)
    {
        _context = context;
        _autoAssignmentService = autoAssignmentService;
        _slaService = slaService;
    }

    // -------------------------
    // CREATE TICKET (Phase 4 enhanced)
    // -------------------------
    public async Task<TicketResponseDto> CreateTicketAsync(
        CreateTicketRequestDto dto, int userId)
    {
        var category = await _context.TicketCategories
            .FirstOrDefaultAsync(c => c.Id == dto.CategoryId && c.IsActive)
            ?? throw new BusinessRuleViolationException(
                "Invalid or inactive ticket category");
        
        var priority = await _context.TicketPriorities
            .FirstOrDefaultAsync(p => p.Id == dto.PriorityId && p.IsActive)
            ?? throw new BusinessRuleViolationException("Invalid or inactive priority");

        var sla = await ResolveSlaForPriorityAsync(priority.Level);

        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            PriorityId = priority.Id,
            SLAId = sla.Id,
            CreatedByUserId = userId,
            Status = TicketStatus.Created,
            CreatedAt = DateTime.UtcNow
        };

        // -------------------------
        // PHASE 4: AUTO ASSIGNMENT
        // -------------------------
        if (priority.Level is 3 or 4)
        {
            var agentId = await _autoAssignmentService.GetAvailableAgentAsync();

            if (agentId.HasValue)
            {
                ticket.AssignedToUserId = agentId.Value;
                ticket.Status = TicketStatus.Assigned;

                _context.TicketAssignments.Add(new TicketAssignment
                {
                    Ticket = ticket,
                    AssignedToUserId = agentId.Value,
                    AssignedByUserId = userId,
                    AssignedAt = DateTime.UtcNow
                });

                _context.TicketActivities.Add(new TicketActivity
                {
                    Ticket = ticket,
                    Action = "AutoAssigned",
                    FieldName = "AssignedToUserId",
                    OldValue = null,
                    NewValue = agentId.Value.ToString(),
                    PerformedByUserId = userId,
                    PerformedAt = DateTime.UtcNow
                });
            }
        }

        _context.Tickets.Add(ticket);

        _context.TicketActivities.Add(new TicketActivity
        {
            Ticket = ticket,
            Action = "Created",
            FieldName = "Status",
            OldValue = null,
            NewValue = ticket.Status.ToString(),
            PerformedByUserId = userId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
        return MapToDto(ticket);
    }

    // -------------------------
    // ASSIGN TICKET (manual)
    // -------------------------
    public async Task AssignTicketAsync(
        AssignTicketRequestDto dto, int performedByUserId)
    {
        var ticket = await _context.Tickets.FindAsync(dto.TicketId)
            ?? throw new BusinessRuleViolationException("Ticket not found");

        // Terminal state protection
        if (ticket.Status == TicketStatus.Cancelled)
            throw new BusinessRuleViolationException(
                "Cannot assign a cancelled ticket");

        if (ticket.Status == TicketStatus.Closed)
            throw new BusinessRuleViolationException(
                "Cannot assign a closed ticket");

        var oldAssignee = ticket.AssignedToUserId;

        ticket.AssignedToUserId = dto.AgentUserId;
        ticket.Status = TicketStatus.Assigned;

        _context.TicketAssignments.Add(new TicketAssignment
        {
            TicketId = ticket.Id,
            AssignedToUserId = dto.AgentUserId,
            AssignedByUserId = performedByUserId,
            AssignedAt = DateTime.UtcNow
        });

        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticket.Id,
            Action = "AssignmentChanged",
            FieldName = "AssignedToUserId",
            OldValue = oldAssignee?.ToString(),
            NewValue = dto.AgentUserId.ToString(),
            PerformedByUserId = performedByUserId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    // -------------------------
    // UPDATE STATUS
    // -------------------------
    public async Task UpdateTicketStatusAsync(
        UpdateTicketStatusDto dto, int performedByUserId)
    {
        var ticket = await _context.Tickets.FindAsync(dto.TicketId)
            ?? throw new BusinessRuleViolationException("Ticket not found");

        if (!AllowedTransitions.TryGetValue(ticket.Status, out var allowed) ||
            !allowed.Contains(dto.NewStatus))
        {
            throw new BusinessRuleViolationException(
                $"Invalid transition from {ticket.Status} to {dto.NewStatus}");
        }

        var oldStatus = ticket.Status;
        ticket.Status = dto.NewStatus;

        // Lifecycle timestamps 
        if (dto.NewStatus == TicketStatus.Resolved)
        {
            ticket.ResolvedAt = DateTime.UtcNow;
        }

        if (dto.NewStatus == TicketStatus.Closed)
        {
            ticket.ClosedAt = DateTime.UtcNow;
        }

        // if (dto.NewStatus == TicketStatus.Reopened)
        // {
        //     ticket.AssignedToUserId = null;
        // }

        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticket.Id,
            Action = "StatusChanged",
            FieldName = "Status",
            OldValue = oldStatus.ToString(),
            NewValue = dto.NewStatus.ToString(),
            PerformedByUserId = performedByUserId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }


    // -------------------------
    // CANCEL TICKETS
    // -------------------------

    public async Task CancelTicketAsync(int ticketId, int performedByUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId)
            ?? throw new BusinessRuleViolationException("Ticket not found");

        if (!AllowedTransitions[ticket.Status].Contains(TicketStatus.Cancelled))
            throw new BusinessRuleViolationException(
                $"Cannot cancel ticket from {ticket.Status}");

        var oldStatus = ticket.Status;

        ticket.Status = TicketStatus.Cancelled;
        ticket.CancelledAt = DateTime.UtcNow;

        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticket.Id,
            Action = "StatusChanged",
            FieldName = "Status",
            OldValue = oldStatus.ToString(),
            NewValue = TicketStatus.Cancelled.ToString(),
            PerformedByUserId = performedByUserId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    // -------------------------
    // REOPEN TICKET
    // -------------------------

    public async Task ReopenTicketAsync(int ticketId, int performedByUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId)
            ?? throw new BusinessRuleViolationException("Ticket not found");

        if (!AllowedTransitions[ticket.Status].Contains(TicketStatus.Reopened))
            throw new BusinessRuleViolationException(
                $"Cannot reopen ticket from {ticket.Status}");

        var oldStatus = ticket.Status;

        ticket.Status = TicketStatus.Reopened;
        ticket.ReopenedAt = DateTime.UtcNow;

        ticket.AssignedToUserId = null;

        // reset terminal timestamps
        ticket.ResolvedAt = null;
        ticket.ClosedAt = null;

        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticket.Id,
            Action = "StatusChanged",
            FieldName = "Status",
            OldValue = oldStatus.ToString(),
            NewValue = TicketStatus.Reopened.ToString(),
            PerformedByUserId = performedByUserId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    //ESCALATE TICKET
    public async Task EscalateTicketAsync(int ticketId, int userId)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket == null)
            throw new NotFoundException("Ticket not found");

        if (ticket.CreatedByUserId != userId)
            throw new BusinessRuleViolationException("Only ticket creator can escalate");

        if (ticket.IsEscalated)
            return; // idempotent

        ticket.IsEscalated = true;
        ticket.EscalatedAt = DateTime.UtcNow;

        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticketId,
            Action = "Escalated",
            FieldName = "IsEscalated",
            OldValue = "False",
            NewValue = "True",
            PerformedByUserId = userId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }



    // -------------------------
    // QUERY METHODS
    // -------------------------
   
    // EXISTING — unchanged
    public async Task<IEnumerable<TicketResponseDto>> GetMyTicketsAsync(int userId)
        => await _context.Tickets
            .Where(t => t.CreatedByUserId == userId)
            .Select(t => MapToDto(t))
            .ToListAsync();

    // NEW — role-aware
    public async Task<IEnumerable<TicketListItemDto>> GetMyTicketsAsync(int userId, string role)
{
    IQueryable<Ticket> query = _context.Tickets
        .Include(t => t.Category)
        .Include(t => t.Priority);

    if (role == "EndUser")
        query = query.Where(t => t.CreatedByUserId == userId);
    else if (role == "SupportAgent")
        query = query.Where(t => t.AssignedToUserId == userId);
    else
        return Enumerable.Empty<TicketListItemDto>();

    return await query
        .Select(t => MapToListDto(t))
        .ToListAsync();
}



    public async Task<IEnumerable<TicketResponseDto>> GetAssignedTicketsAsync(int agentId)
        => await _context.Tickets
            .Where(t => t.AssignedToUserId == agentId)
            .Select(t => MapToDto(t))
            .ToListAsync();

    // -------------------------
    // SLA RESOLVER (unchanged)
    // -------------------------
    private async Task<SLAPolicy> ResolveSlaForPriorityAsync(int priorityName)
    {
        var slaName = priorityName switch
        {
            1 => "Low SLA",
            2 => "Medium SLA",
            3 => "High SLA",
            4 => "Critical SLA",
            _ => throw new BusinessRuleViolationException(
                $"No SLA policy mapped for priority '{priorityName}'")
        };

        var sla = await _context.SLAPolicies
            .FirstOrDefaultAsync(s => s.Name == slaName && s.IsActive);


        if (sla == null)
            throw new BusinessRuleViolationException(
                $"SLA policy '{slaName}' not found in system");

        return sla;
    }

    // -------------------------
    // MAPPER
    // -------------------------
    private static TicketResponseDto MapToDto(Ticket ticket)
        => new()
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status,
            PriorityId = ticket.PriorityId,
            CategoryId = ticket.CategoryId,
            AssignedToUserId = ticket.AssignedToUserId,
            CreatedAt = ticket.CreatedAt
        };

    private static TicketListItemDto MapToListDto(Ticket ticket)
    {
        return new TicketListItemDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Category = ticket.Category.Name,
            Priority = ticket.Priority.Name,
            Status = ticket.Status.ToString(),
            CreatedAt = ticket.CreatedAt
        };
    }

    public async Task<TicketDetailsDto> GetTicketByIdAsync(
    int ticketId,
    int userId,
    string role)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.SLA)
            .Include(t => t.AssignedToUser)
            .FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket == null)
            throw new NotFoundException("Ticket not found");

        // -------------------------
        // ACCESS CONTROL
        // -------------------------
        if (role == "EndUser" && ticket.CreatedByUserId != userId)
            throw new UnauthorizedException("Access denied");

        // (SupportAgent & SupportManager are allowed by design)

        // -------------------------
        // DTO MAPPING
        // -------------------------
        return new TicketDetailsDto
        {
            TicketId = ticket.Id,

            // Core Info
            Title = ticket.Title,
            Description = ticket.Description,
            Status = ticket.Status.ToString(),

            // Classification
            Category = ticket.Category.Name,
            Priority = ticket.Priority.Name,

            // Assignment
            AssignedToUserId = ticket.AssignedToUserId,
            AssignedToName = ticket.AssignedToUser?.FullName,

            // SLA
            SlaName = ticket.SLA.Name,
            IsSlaBreached =
                ticket.Status != TicketStatus.Resolved &&
                ticket.Status != TicketStatus.Closed &&
                _slaService.IsSlaBreached(ticket.CreatedAt, ticket.SLA),

            // 🔴 ESCALATION (REQUIRED)
            IsEscalated = ticket.IsEscalated,
            EscalatedAt = ticket.EscalatedAt,

            // Timestamps
            CreatedAt = ticket.CreatedAt,
            ResolvedAt = ticket.ResolvedAt,
            ClosedAt = ticket.ClosedAt
        };
    }
    
    public async Task<IReadOnlyList<TicketActivityDto>> GetTicketActivitiesAsync(
        int ticketId,
        int userId,
        string role)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId)
            ?? throw new NotFoundException("Ticket not found");

        // 🔐 Access control
        if (role == "EndUser" && ticket.CreatedByUserId != userId)
            throw new UnauthorizedException("Access denied");

        if (role == "SupportAgent" && ticket.AssignedToUserId != userId)
            throw new UnauthorizedException("Access denied");

        // SupportManager → full access

        return await _context.TicketActivities
            .Where(a => a.TicketId == ticketId)
            .OrderByDescending(a => a.PerformedAt)
            .Select(a => new TicketActivityDto
            {
                Action = a.Action,
                FieldName = a.FieldName,
                OldValue = a.OldValue,
                NewValue = a.NewValue,
                PerformedByUserId = a.PerformedByUserId,
                PerformedAt = a.PerformedAt
            })
            .ToListAsync();
    }



}
