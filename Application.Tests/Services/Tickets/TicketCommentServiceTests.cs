using Application.DTOs.Tickets;
using Application.Exceptions;
using Application.Services.Tickets;
using Domain.Entities;
using Domain.Enums;
using FluentAssertions;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;


namespace Application.Tests.Services.Tickets;

public class TicketCommentServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly TicketCommentService _service;

    public TicketCommentServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new ApplicationDbContext(options);
        _service = new TicketCommentService(_context);
    }

    [Fact]
    public async Task TicketCreator_Can_Add_Comment()
    {
        var ticket = new Ticket
        {
            Id = 1,
            Title = "Test Ticket",
            Description = "Test ticket description",
            CreatedByUserId = 1,
            Status = TicketStatus.Created
        };



        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        await _service.AddCommentAsync(
            ticket.Id,
            1,
            new AddTicketCommentRequest { Content = "Hello" });

        _context.TicketComments.Should().HaveCount(1);
        _context.TicketActivities.Should().HaveCount(1);
    }

    [Fact]
    public async Task AssignedAgent_Can_Add_Comment()
    {
        var ticket = new Ticket
        {
            Id = 2,
            Title = "Assigned Ticket",
            Description = "Assigned ticket description",
            CreatedByUserId = 1,
            AssignedToUserId = 2,
            Status = TicketStatus.Assigned,
            Assignments =
            {
                new TicketAssignment
                {
                    AssignedToUserId = 2,
                    AssignedAt = DateTime.UtcNow
                }
            }
        };


        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        await _service.AddCommentAsync(
            ticket.Id,
            2,
            new AddTicketCommentRequest { Content = "Agent reply" });

        _context.TicketComments.Should().HaveCount(1);
    }

    [Fact]
    public async Task Unauthorized_User_Cannot_Add_Comment()
    {
        var ticket = new Ticket
        {
            Id = 3,
            Title = "Unauthorized comment test",
            Description = "This ticket is used to test unauthorized comment access",
            CreatedByUserId = 1,
            Status = TicketStatus.Created
        };


        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        Func<Task> act = () =>
            _service.AddCommentAsync(
                ticket.Id,
                99,
                new AddTicketCommentRequest { Content = "Hack" });

        await act.Should().ThrowAsync<BusinessRuleViolationException>();
    }

    
}
