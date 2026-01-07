
using Application.Services.Reports;
using Application.Services.Tickets;
using Application.Interfaces.Tickets;

using Domain.Entities;
using Domain.Enums;
using FluentAssertions;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.Tests.Services.Tickets;

public class ReportingServiceTests
{
    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetSlaComplianceReport_Should_Calculate_Correct_Compliance()
    {
        // -------------------------
        // ARRANGE
        // -------------------------
        var context = CreateDbContext();

        ISlaService slaService = new SlaService();
        var reportingService = new ReportingService(context, slaService);

        var creator = new User
        {
            Id = 1,
            FullName = "Creator",
            Email = "creator@test.com",
            PasswordHash = "TEST_HASH",
            IsActive = true,
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        };

        var category = new TicketCategory
        {
            Name = "Hardware",
            IsActive = true
        };

        var priority = new TicketPriority
        {
            Name = "High",
            IsActive = true
        };

        var sla = new SLAPolicy
        {
            Name = "High SLA",
            ResolutionHours = 24,
            IsActive = true
        };

        context.Users.Add(creator);
        context.TicketCategories.Add(category);
        context.TicketPriorities.Add(priority);
        context.SLAPolicies.Add(sla);

        // SLA-eligible tickets
        for (int i = 0; i < 5; i++)
        {
            context.Tickets.Add(new Ticket
            {
                Title = $"Ticket {i}",
                Description = "Test",
                Status = TicketStatus.Resolved,
                Category = category,
                Priority = priority,
                SLA = sla,
                CreatedByUserId = creator.Id,
                CreatedByUser = creator,
                CreatedAt = DateTime.UtcNow.AddHours(-48),
                ResolvedAt = DateTime.UtcNow.AddHours(-1)
            });
        }

        await context.SaveChangesAsync();

        // -------------------------
        // ACT
        // -------------------------
        var result = await reportingService.GetSlaComplianceReportAsync();

        // -------------------------
        // ASSERT
        // -------------------------
        result.Should().NotBeNull();
        result.TotalTickets.Should().Be(5);
    }
}
