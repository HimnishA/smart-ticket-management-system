using Application.DTOs.Reports;
using Application.Interfaces.Reports;
using Application.Interfaces.Tickets;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Reports;

public class ReportingService : IReportingService
{
    private readonly ApplicationDbContext _context;
    private readonly ISlaService _slaService;

    public ReportingService(
        ApplicationDbContext context,
        ISlaService slaService)
    {
        _context = context;
        _slaService = slaService;
    }

    // -----------------------------
    // SLA COMPLIANCE
    // -----------------------------
    public async Task<SlaComplianceDto> GetSlaComplianceReportAsync()
    {
        var tickets = await _context.Tickets
            .Include(t => t.SLA)
            .Where(t =>
                t.Status == TicketStatus.Resolved ||
                t.Status == TicketStatus.Closed)
            .ToListAsync();

        var breachedCount = tickets.Count(t =>
            _slaService.IsSlaBreached(t.CreatedAt, t.SLA));

        var totalCount = tickets.Count;

        return new SlaComplianceDto
        {
            TotalTickets = totalCount,
            BreachedTickets = breachedCount,
            CompliancePercentage = totalCount == 0
                ? 100
                : Math.Round(
                    ((double)(totalCount - breachedCount) / totalCount) * 100,
                    2)
        };
    }

    // -----------------------------
    // TICKETS BY STATUS
    // -----------------------------
    public async Task<List<TicketCountDto>> GetTicketsByStatusAsync()
    {
        return await _context.Tickets
            .GroupBy(t => t.Status)
            .Select(g => new TicketCountDto
            {
                Label = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();
    }

    // -----------------------------
    // TICKETS BY PRIORITY
    // -----------------------------
    public async Task<List<TicketCountDto>> GetTicketsByPriorityAsync()
    {
        return await _context.Tickets
            .Include(t => t.Priority)
            .GroupBy(t => t.Priority.Name)
            .Select(g => new TicketCountDto
            {
                Label = g.Key,
                Count = g.Count()
            })
            .ToListAsync();
    }

    // -----------------------------
    // TICKETS BY CATEGORY
    // -----------------------------
    public async Task<List<TicketCountDto>> GetTicketsByCategoryAsync()
    {
        return await _context.Tickets
            .Include(t => t.Category)
            .GroupBy(t => t.Category.Name)
            .Select(g => new TicketCountDto
            {
                Label = g.Key,
                Count = g.Count()
            })
            .ToListAsync();
    }

    // -----------------------------
    // AVERAGE RESOLUTION TIME
    // -----------------------------
    public async Task<AverageResolutionTimeDto> GetAverageResolutionTimeAsync()
    {
        var resolvedTickets = await _context.Tickets
            .Where(t =>
                t.ResolvedAt != null &&
                (t.Status == TicketStatus.Resolved ||
                 t.Status == TicketStatus.Closed))
            .ToListAsync();

        if (!resolvedTickets.Any())
        {
            return new AverageResolutionTimeDto { AverageResolutionHours = 0 };
        }

        var avgHours = resolvedTickets
            .Average(t =>
                (t.ResolvedAt!.Value - t.CreatedAt).TotalHours);

        return new AverageResolutionTimeDto
        {
            AverageResolutionHours = Math.Round(avgHours, 2)
        };
    }

    // -----------------------------
    // AGENT WORKLOAD
    // -----------------------------
    public async Task<List<AgentWorkloadDto>> GetAgentWorkloadAsync()
    {
        return await _context.Tickets
            .Include(t => t.AssignedToUser)
            .Where(t =>
                t.AssignedToUserId != null &&
                t.Status != TicketStatus.Closed &&
                t.Status != TicketStatus.Cancelled)
            .GroupBy(t => new
            {
                t.AssignedToUserId,
                t.AssignedToUser!.FullName
            })
            .Select(g => new AgentWorkloadDto
            {
                AgentId = g.Key.AssignedToUserId!.Value,
                AgentName = g.Key.FullName,
                ActiveTicketCount = g.Count()
            })
            .ToListAsync();
    }

    // -------------------------
    // SUPPORT AGENT DASHBOARD
    // -------------------------
    public async Task<AgentDashboardDto> GetAgentDashboardAsync(int agentUserId)
    {
        var agentTicketsQuery = _context.Tickets
            .AsNoTracking()
            .Where(t => t.AssignedToUserId == agentUserId);

        var myTotalTickets = await agentTicketsQuery.CountAsync();

        var myActiveTickets = await agentTicketsQuery
            .Where(t => t.Status != TicketStatus.Closed &&
                        t.Status != TicketStatus.Cancelled)
            .CountAsync();

        var ticketsByStatus = await agentTicketsQuery
            .GroupBy(t => t.Status)
            .Select(g => new TicketsByStatusDto
            {
                Status = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        var ticketsByPriority = await agentTicketsQuery
            .GroupBy(t => t.Priority.Name)
            .Select(g => new TicketsByPriorityDto
            {
                Priority = g.Key,
                Count = g.Count()
            })
            .ToListAsync();


        var myTickets = await agentTicketsQuery
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new AgentTicketDto
            {
                Id = t.Id,
                Title = t.Title,
                Category = t.Category.Name,
                Priority = t.Priority.Name,
                Status = t.Status.ToString(),
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return new AgentDashboardDto
        {
            MyActiveTickets = myActiveTickets,
            MyTotalTickets = myTotalTickets,
            TicketsByStatus = ticketsByStatus,
            TicketsByPriority = ticketsByPriority,
            MyTickets = myTickets
        };

    }


    // -------------------------
    // END USER DASHBOARD
    // -------------------------
    public async Task<UserDashboardDto> GetUserDashboardAsync(int userId)
    {
        var userTickets = _context.Tickets
            .AsNoTracking()
            .Where(t => t.CreatedByUserId == userId);

        var total = await userTickets.CountAsync();

        var open = await userTickets
            .Where(t =>
                t.Status != TicketStatus.Closed &&
                t.Status != TicketStatus.Cancelled)
            .CountAsync();

        var byStatus = await userTickets
            .GroupBy(t => t.Status)
            .Select(g => new TicketCountDto
            {
                Label = g.Key.ToString(),
                Count = g.Count()
            })
            .ToListAsync();

        return new UserDashboardDto
        {
            MyOpenTickets = open,
            MyTotalTickets = total,
            TicketsByStatus = byStatus
        };
    }

}
