using Application.Services.Tickets.Monitoring;
using Application.Services.Tickets;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace Application.Tests.Services.Tickets.Monitoring;

public class SlaMonitoringServiceTests
{
    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task DetectBreachesAsync_Should_Log_SlaBreach_Activity()
    {
        // Arrange
        using var context = CreateDbContext();

        var slaPolicy = new SLAPolicy
        {
            Id = 1,
            Name = "High SLA",
            ResolutionHours = 1
        };

        var ticket = new Ticket
        {
            Id = 1,
            Title = "SLA breach ticket",
            Description = "This ticket has breached SLA",
            Status = TicketStatus.InProgress,
            CreatedAt = DateTime.UtcNow.AddHours(-5),
            SLA = slaPolicy,
            SLAId = slaPolicy.Id
        };

        context.SLAPolicies.Add(slaPolicy);
        context.Tickets.Add(ticket);

        await context.SaveChangesAsync();

        var slaService = new SlaService();
        var monitoringService = new SlaMonitoringService(context, slaService);

        // Act
        await monitoringService.DetectBreachesAsync();

        // Assert
        var activity = await context.TicketActivities.FirstOrDefaultAsync();

        activity.Should().NotBeNull();
        activity!.TicketId.Should().Be(ticket.Id);
        activity.Action.Should().Be("SLA_BREACHED");
        activity.FieldName.Should().Be("SLA");
        activity.NewValue.Should().Be("Breached");
    }

    [Fact]
    public async Task DetectBreachesAsync_Should_Not_Duplicate_SlaBreach_Activity()
    {
        // Arrange
        using var context = CreateDbContext();

        var slaPolicy = new SLAPolicy
        {
            Id = 1,
            Name = "High SLA",
            ResolutionHours = 1
        };

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Duplicate SLA breach ticket",
            Description = "Already breached",
            Status = TicketStatus.InProgress,
            CreatedAt = DateTime.UtcNow.AddHours(-5),
            SLA = slaPolicy,
            SLAId = slaPolicy.Id
        };

        context.SLAPolicies.Add(slaPolicy);
        context.Tickets.Add(ticket);

        context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticket.Id,
            Action = "SLA_BREACHED",
            FieldName = "SLA",
            OldValue = "Within SLA",
            NewValue = "Breached",
            PerformedAt = DateTime.UtcNow
        });

        await context.SaveChangesAsync();

        var slaService = new SlaService();
        var monitoringService = new SlaMonitoringService(context, slaService);

        // Act
        await monitoringService.DetectBreachesAsync();

        // Assert
        var breachLogs = await context.TicketActivities
            .Where(a => a.Action == "SLA_BREACHED")
            .ToListAsync();

        breachLogs.Should().HaveCount(1);
    }

    [Fact]
    public async Task DetectBreachesAsync_Should_Ignore_Resolved_And_Closed_Tickets()
    {
        // Arrange
        using var context = CreateDbContext();

        var slaPolicy = new SLAPolicy
        {
            Id = 1,
            Name = "High SLA",
            ResolutionHours = 1
        };

        var resolvedTicket = new Ticket
        {
            Id = 1,
            Title = "Resolved ticket",
            Description = "Already resolved",
            Status = TicketStatus.Resolved,
            CreatedAt = DateTime.UtcNow.AddHours(-5),
            SLA = slaPolicy,
            SLAId = slaPolicy.Id
        };

        context.SLAPolicies.Add(slaPolicy);
        context.Tickets.Add(resolvedTicket);

        await context.SaveChangesAsync();

        var slaService = new SlaService();
        var monitoringService = new SlaMonitoringService(context, slaService);

        // Act
        await monitoringService.DetectBreachesAsync();

        // Assert
        var activities = await context.TicketActivities.ToListAsync();
        activities.Should().BeEmpty();
    }
}
