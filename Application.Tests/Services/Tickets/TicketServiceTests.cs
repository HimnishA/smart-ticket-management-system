using Application.Services.Tickets;
using Application.DTOs.Tickets;
using Application.Interfaces.Tickets;
using Application.Exceptions;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Moq;
using Xunit;

namespace Application.Tests.Services.Tickets;

public class TicketServiceTests
{
    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    private static TicketService CreateService(
        ApplicationDbContext context,
        int? autoAssignAgentId = null)
    {
        var autoAssignMock = new Mock<IAutoAssignmentService>();
        autoAssignMock
            .Setup(a => a.GetAvailableAgentAsync())
            .ReturnsAsync(autoAssignAgentId);

        var slaServiceMock = new Mock<ISlaService>();

        return new TicketService(
            context,
            autoAssignMock.Object,
            slaServiceMock.Object
        );
    }

    [Fact]
    public async Task CreateTicketAsync_Should_Create_Ticket_With_Created_Status()
    {
        using var context = CreateDbContext();

        context.TicketCategories.Add(new TicketCategory
        {
            Id = 1,
            Name = "Software",
            IsActive = true
        });

        context.TicketPriorities.Add(new TicketPriority
        {
            Id = 1,
            Name = "Low",
            IsActive = true
        });

        context.SLAPolicies.Add(new SLAPolicy
        {
            Id = 1,
            Name = "Low SLA",
            ResolutionHours = 24,
            IsActive = true
        });

        await context.SaveChangesAsync();

        var service = CreateService(context);

        var dto = new CreateTicketRequestDto
        {
            Title = "Test Ticket",
            Description = "Creation test",
            CategoryId = 1,     // ✅ REQUIRED NOW
            PriorityId = 1
        };

        var result = await service.CreateTicketAsync(dto, userId: 99);

        result.Status.Should().Be(TicketStatus.Created);
    }



    [Fact]
    public async Task CreateTicketAsync_Should_AutoAssign_For_High_Priority()
    {
        using var context = CreateDbContext();

        context.TicketCategories.Add(new TicketCategory
        {
            Id = 1,
            Name = "Software",
            IsActive = true
        });

        context.TicketPriorities.Add(new TicketPriority
        {
            Id = 2,
            Name = "High",
            IsActive = true
        });

        context.SLAPolicies.Add(new SLAPolicy
        {
            Id = 2,
            Name = "High SLA",
            ResolutionHours = 4,
            IsActive = true
        });

        await context.SaveChangesAsync();

        var service = CreateService(context, autoAssignAgentId: 10);

        var dto = new CreateTicketRequestDto
        {
            Title = "High priority ticket",
            Description = "Auto assignment test",
            CategoryId = 1,   // ✅ REQUIRED NOW
            PriorityId = 2
        };

        var result = await service.CreateTicketAsync(dto, userId: 1);

        result.Status.Should().Be(TicketStatus.Assigned);
        result.AssignedToUserId.Should().Be(10);
    }


    [Fact]
    public async Task UpdateTicketStatusAsync_Should_Allow_Valid_Transition()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Progress ticket",
            Description = "Valid transition test",   // ✅ ADD THIS
            Status = TicketStatus.Assigned,
            CreatedAt = DateTime.UtcNow
        };


        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        var dto = new UpdateTicketStatusDto
        {
            TicketId = 1,
            NewStatus = TicketStatus.InProgress
        };

        await service.UpdateTicketStatusAsync(dto, performedByUserId: 1);

        var updated = await context.Tickets.FirstAsync();
        updated.Status.Should().Be(TicketStatus.InProgress);
    }

    [Fact]
    public async Task UpdateTicketStatusAsync_Should_Throw_For_Invalid_Transition()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Invalid transition ticket",
            Description = "Invalid transition test",  // ✅ ADD THIS
            Status = TicketStatus.Created,
            CreatedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        var dto = new UpdateTicketStatusDto
        {
            TicketId = 1,
            NewStatus = TicketStatus.Resolved // ❌ invalid jump
        };

        await FluentActions
            .Invoking(() => service.UpdateTicketStatusAsync(dto, 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task CancelTicketAsync_FromCreated_Should_Succeed()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Cancelable ticket",
            Description = "Cancel test",
            Status = TicketStatus.Created,
            CreatedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await service.CancelTicketAsync(ticket.Id, performedByUserId: 1);

        var updated = await context.Tickets.FirstAsync();
        updated.Status.Should().Be(TicketStatus.Cancelled);
        updated.CancelledAt.Should().NotBeNull();

        context.TicketActivities.Should().ContainSingle(a =>
            a.TicketId == ticket.Id &&
            a.NewValue == TicketStatus.Cancelled.ToString());
    }

    [Fact]
    public async Task CancelTicketAsync_FromResolved_Should_Throw()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Resolved ticket",
            Description = "Invalid cancel test",
            Status = TicketStatus.Resolved,
            CreatedAt = DateTime.UtcNow,
            ResolvedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await FluentActions
            .Invoking(() => service.CancelTicketAsync(ticket.Id, 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task ReopenTicketAsync_FromResolved_Should_Succeed()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Resolved ticket",
            Description = "Reopen test",
            Status = TicketStatus.Resolved,
            CreatedAt = DateTime.UtcNow,
            ResolvedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await service.ReopenTicketAsync(ticket.Id, performedByUserId: 1);

        var updated = await context.Tickets.FirstAsync();
        updated.Status.Should().Be(TicketStatus.Reopened);
        updated.ReopenedAt.Should().NotBeNull();
        updated.ResolvedAt.Should().BeNull();

        context.TicketActivities.Should().ContainSingle(a =>
            a.TicketId == ticket.Id &&
            a.NewValue == TicketStatus.Reopened.ToString());
    }

    [Fact]
    public async Task ReopenTicketAsync_FromInProgress_Should_Throw()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "In progress ticket",
            Description = "Invalid reopen test",
            Status = TicketStatus.InProgress,
            CreatedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await FluentActions
            .Invoking(() => service.ReopenTicketAsync(ticket.Id, 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task CancelledTicket_Should_Block_Reopen()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Id = 1,
            Title = "Cancelled ticket",
            Description = "Terminal state test",
            Status = TicketStatus.Cancelled,
            CreatedAt = DateTime.UtcNow,
            CancelledAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await FluentActions
            .Invoking(() => service.ReopenTicketAsync(ticket.Id, 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }


    [Fact]
    public async Task AssignTicketAsync_Should_Throw_When_Ticket_Is_Cancelled()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Title = "Cancelled ticket",
            Description = "Assign blocked",
            Status = TicketStatus.Cancelled,
            CreatedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await FluentActions
            .Invoking(() => service.AssignTicketAsync(
                new AssignTicketRequestDto
                {
                    TicketId = ticket.Id,
                    AgentUserId = 10
                },
                performedByUserId: 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task AssignTicketAsync_Should_Throw_When_Ticket_Is_Closed()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Title = "Closed ticket",
            Description = "Assign blocked",
            Status = TicketStatus.Closed,
            CreatedAt = DateTime.UtcNow,
            ClosedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await FluentActions
            .Invoking(() => service.AssignTicketAsync(
                new AssignTicketRequestDto
                {
                    TicketId = ticket.Id,
                    AgentUserId = 10
                },
                performedByUserId: 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }

    [Fact]
    public async Task UpdateTicketStatusAsync_Should_Set_ResolvedAt()
    {
        using var context = CreateDbContext();

        var ticket = new Ticket
        {
            Title = "Resolve test",
            Description = "ResolvedAt test",
            Status = TicketStatus.InProgress,
            CreatedAt = DateTime.UtcNow
        };

        context.Tickets.Add(ticket);
        await context.SaveChangesAsync();

        var service = CreateService(context);

        await service.UpdateTicketStatusAsync(
            new UpdateTicketStatusDto
            {
                TicketId = ticket.Id,
                NewStatus = TicketStatus.Resolved
            },
            performedByUserId: 1);

        var updated = await context.Tickets.FirstAsync();
        updated.ResolvedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateTicketAsync_Should_Throw_When_Priority_Is_Inactive()
    {
        using var context = CreateDbContext();

        context.TicketCategories.Add(new TicketCategory
        {
            Id = 1,
            Name = "Software",
            IsActive = true
        });

        context.TicketPriorities.Add(new TicketPriority
        {
            Id = 1,
            Name = "Low",
            IsActive = false
        });

        context.SLAPolicies.Add(new SLAPolicy
        {
            Id = 1,
            Name = "Low SLA",
            ResolutionHours = 24,
            IsActive = true
        });

        await context.SaveChangesAsync();

        var service = CreateService(context);

        await FluentActions
            .Invoking(() => service.CreateTicketAsync(
                new CreateTicketRequestDto
                {
                    Title = "Inactive priority test",
                    Description = "Should fail",
                    CategoryId = 1,
                    PriorityId = 1
                },
                userId: 1))
            .Should()
            .ThrowAsync<BusinessRuleViolationException>();
    }




}
