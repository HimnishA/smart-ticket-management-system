using Application.Exceptions;
using Application.Services.SupportManager;
using Domain.Entities;
using Domain.Enums;
using FluentAssertions;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Application.Tests.Services.SupportManager;

public class SupportManagerAssignmentServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly SupportManagerAssignmentService _service;

    public SupportManagerAssignmentServiceTests()
    {
        _context = TestDbContextFactory.Create();
        _service = new SupportManagerAssignmentService(_context);
    }

    // -------------------------------------------------
    // HELPERS
    // -------------------------------------------------
    private async Task<User> CreateSupportAgentAsync(int id)
    {
        var role = new Role { Name = "SupportAgent" };

        var user = new User
        {
            Id = id,
            FullName = "Agent One",
            Email = $"agent{id}@test.com",
            PasswordHash = "TEST_HASH", // ✅ REQUIRED
            IsActive = true,
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Roles.Add(role);
        _context.Users.Add(user);

        _context.UserRoles.Add(new UserRole
        {
            User = user,
            Role = role
        });

        await _context.SaveChangesAsync();
        return user;
    }

    private async Task<User> CreateNormalUserAsync(int id)
    {
        var user = new User
        {
            Id = id,
            FullName = "Normal User",
            Email = $"user{id}@test.com",
            PasswordHash = "TEST_HASH", // ✅ REQUIRED
            IsActive = true,
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    private async Task<Ticket> CreateTicketAsync(TicketStatus status)
    {
        var creator = await CreateNormalUserAsync(100);

        var category = new TicketCategory { Name = "Hardware", IsActive = true };
        var priority = new TicketPriority { Name = "High", IsActive = true };
        var sla = new SLAPolicy { Name = "High SLA", ResolutionHours = 24 };

        var ticket = new Ticket
        {
            Title = "Test Ticket",
            Description = "Test",
            Status = status,
            Category = category,
            Priority = priority,
            SLA = sla,
            CreatedByUserId = creator.Id,
            CreatedByUser = creator,
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketCategories.Add(category);
        _context.TicketPriorities.Add(priority);
        _context.SLAPolicies.Add(sla);
        _context.Tickets.Add(ticket);

        await _context.SaveChangesAsync();
        return ticket;
    }

    // -------------------------------------------------
    // TESTS
    // -------------------------------------------------

    [Fact]
    public async Task AssignTicket_Should_Assign_Ticket_To_SupportAgent()
    {
        var agent = await CreateSupportAgentAsync(1);
        var ticket = await CreateTicketAsync(TicketStatus.Created);

        await _service.AssignTicketAsync(ticket.Id, agent.Id, 999);

        var updatedTicket = await _context.Tickets.FirstAsync();

        updatedTicket.AssignedToUserId.Should().Be(agent.Id);
        updatedTicket.Status.Should().Be(TicketStatus.Assigned);

        _context.TicketAssignments.Should().HaveCount(1);
        _context.TicketActivities.Should().HaveCount(1);
    }

    [Fact]
    public async Task AssignTicket_Should_Throw_When_Ticket_Not_Found()
    {
        var act = async () =>
            await _service.AssignTicketAsync(999, 1, 1);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task AssignTicket_Should_Throw_When_Ticket_Is_Closed()
    {
        var agent = await CreateSupportAgentAsync(1);
        var ticket = await CreateTicketAsync(TicketStatus.Closed);

        var act = async () =>
            await _service.AssignTicketAsync(ticket.Id, agent.Id, 1);

        await act.Should().ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task AssignTicket_Should_Throw_When_User_Is_Not_SupportAgent()
    {
        var user = await CreateNormalUserAsync(2);
        var ticket = await CreateTicketAsync(TicketStatus.Created);

        var act = async () =>
            await _service.AssignTicketAsync(ticket.Id, user.Id, 1);

        await act.Should().ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task AssignTicket_Should_Log_Assignment_History()
    {
        var agent = await CreateSupportAgentAsync(1);
        var ticket = await CreateTicketAsync(TicketStatus.Assigned);

        await _service.AssignTicketAsync(ticket.Id, agent.Id, 42);

        var assignment = await _context.TicketAssignments.FirstAsync();

        assignment.AssignedToUserId.Should().Be(agent.Id);
        assignment.AssignedByUserId.Should().Be(42);
    }
}
