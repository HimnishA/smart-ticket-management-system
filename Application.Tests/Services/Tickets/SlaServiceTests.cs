using Application.Services.Tickets;
using Domain.Entities;
using FluentAssertions;
using Xunit;

namespace Application.Tests.Services.Tickets;
public class SlaServiceTests
{
    private readonly SlaService _slaService;

    public SlaServiceTests()
    {
        _slaService = new SlaService();
    }

    [Fact]
    public void CalculateSlaDeadline_Should_Add_SlaDuration_To_CreatedAt()
    {
        // Arrange
        var createdAt = new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc);
        var slaPolicy = new SLAPolicy
        {
            ResolutionHours = 24
        };

        // Act
        var deadline = _slaService.CalculateSlaDeadline(createdAt, slaPolicy);

        // Assert
        deadline.Should().Be(createdAt.AddHours(24));
    }

    [Fact]
    public void IsSlaBreached_Should_Return_False_When_Within_Sla()
    {
        // Arrange
        var createdAt = DateTime.UtcNow.AddHours(-1);
        var slaPolicy = new SLAPolicy
        {
            ResolutionHours = 4
        };

        // Act
        var isBreached = _slaService.IsSlaBreached(createdAt, slaPolicy);

        // Assert
        isBreached.Should().BeFalse();
    }

    [Fact]
    public void IsSlaBreached_Should_Return_True_When_Deadline_Passed()
    {
        // Arrange
        var createdAt = DateTime.UtcNow.AddHours(-10);
        var slaPolicy = new SLAPolicy
        {
            ResolutionHours = 4
        };

        // Act
        var isBreached = _slaService.IsSlaBreached(createdAt, slaPolicy);

        // Assert
        isBreached.Should().BeTrue();
    }
}
