using Application.Interfaces.Tickets;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Tickets.Monitoring;

public class SlaMonitoringService
{
    private readonly ApplicationDbContext _context;
    private readonly ISlaService _slaService;

    public SlaMonitoringService(
        ApplicationDbContext context,
        ISlaService slaService)
    {
        _context = context;
        _slaService = slaService;
    }

    public async Task DetectBreachesAsync()
    {
        // Load active tickets WITH SLA policy
        var tickets = await _context.Tickets
            .Include(t => t.SLA)
            .Where(t =>
                t.Status != TicketStatus.Resolved &&
                t.Status != TicketStatus.Closed)
            .ToListAsync();

        foreach (var ticket in tickets)
        {
            //  Evaluate SLA breach using SLA policy
            var isBreached = _slaService.IsSlaBreached(
                ticket.CreatedAt,
                ticket.SLA
            );

            if (!isBreached)
                continue;

            //  Prevent duplicate SLA breach logs
            var alreadyLogged = await _context.TicketActivities.AnyAsync(a =>
                a.TicketId == ticket.Id &&
                a.Action == "SLA_BREACHED"
            );

            if (alreadyLogged)
                continue;

            //  Log SLA breach (AUDIT ONLY)
            _context.TicketActivities.Add(new TicketActivity
            {
                TicketId = ticket.Id,
                Action = "SLA_BREACHED",
                FieldName = "SLA",
                OldValue = "Within SLA",
                NewValue = "Breached",
                PerformedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
    }
}
