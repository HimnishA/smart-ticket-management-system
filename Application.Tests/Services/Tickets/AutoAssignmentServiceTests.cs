using Application.Services.Tickets;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using FluentAssertions;
using Xunit;

namespace Application.Tests.Services.Tickets;

public class AutoAssignmentServiceTests
{
    private static ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAvailableAgentAsync_Should_Return_Least_Loaded_Agent()
    {
        // Arrange
        using var context = CreateDbContext();

        // Users
        var agent1 = new User
        {
            Id = 1,
            FullName = "Support Agent One",
            Email = "agent1@system.com",
            PasswordHash = "TEST_HASH",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var agent2 = new User
        {
            Id = 2,
            FullName = "Support Agent Two",
            Email = "agent2@system.com",
            PasswordHash = "TEST_HASH",
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        context.Users.AddRange(agent1, agent2);

        // Role (must match real system)
        var supportAgentRole = new Role
        {
            Id = 3,
            Name = "SupportAgent"
        };

        context.Roles.Add(supportAgentRole);

        // User ↔ Role mapping
        context.UserRoles.AddRange(
            new UserRole { UserId = agent1.Id, RoleId = supportAgentRole.Id },
            new UserRole { UserId = agent2.Id, RoleId = supportAgentRole.Id }
        );

        // Agent 1 already has active tickets
        context.Tickets.AddRange(
            new Ticket
            {
                Id = 1,
                Title = "Test Ticket 1",
                Description = "Load test ticket",
                Status = Domain.Enums.TicketStatus.InProgress,
                AssignedToUserId = agent1.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Ticket
            {
                Id = 2,
                Title = "Test Ticket 2",
                Description = "Load test ticket",
                Status = Domain.Enums.TicketStatus.InProgress,
                AssignedToUserId = agent1.Id,
                CreatedAt = DateTime.UtcNow
            }
        );



        await context.SaveChangesAsync();

        var service = new AutoAssignmentService(context);

        // Act
        var selectedAgentId = await service.GetAvailableAgentAsync();

        // Assert
        selectedAgentId.Should().Be(agent2.Id);
    }

    [Fact]
    public async Task GetAvailableAgentAsync_Should_Return_Null_When_No_Agents()
    {
        // Arrange
        using var context = CreateDbContext();
        var service = new AutoAssignmentService(context);

        // Act
        var result = await service.GetAvailableAgentAsync();

        // Assert
        result.Should().BeNull();
    }
}
