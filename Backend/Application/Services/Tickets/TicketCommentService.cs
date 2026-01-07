using Application.DTOs.Tickets;
using Application.Interfaces.Tickets;
using Application.Exceptions;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Tickets;

public class TicketCommentService : ITicketCommentService
{
    private readonly ApplicationDbContext _context;

    public TicketCommentService(ApplicationDbContext context)
    {
        _context = context;
    }

    // -------------------------
    // ADD COMMENT
    // -------------------------
    public async Task AddCommentAsync(
        int ticketId,
        int userId,
        AddTicketCommentRequest request)
    {
        var ticket = await _context.Tickets
            .Include(t => t.Assignments)
            .FirstOrDefaultAsync(t => t.Id == ticketId);
        var users = new User
        {
            Id=userId
        };
        if (ticket is null)
            throw new NotFoundException("Ticket not found");

        if (!CanUserComment(ticket, userId,users))
            throw new BusinessRuleViolationException(
                "User is not allowed to comment on this ticket");

        var comment = new TicketComment
        {
            TicketId = ticketId,
            CreatedByUserId = userId,
            Comment = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketComments.Add(comment);

        _context.TicketActivities.Add(new TicketActivity
        {
            TicketId = ticketId,
            Action = "CommentAdded",
            FieldName = "Comment",
            OldValue = null,
            NewValue = request.Content,
            PerformedByUserId = userId,
            PerformedAt = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();
    }

    // -------------------------
    // GET COMMENTS
    // -------------------------
    public async Task<IReadOnlyList<TicketCommentDto>> GetCommentsAsync(
    int ticketId,
    int userId)
    {
        Console.WriteLine(
            $"Fetching comments for Ticket {ticketId} by User {userId}");

        var ticket = await _context.Tickets
            .Include(t => t.Assignments)
            .FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket is null)
            throw new NotFoundException("Ticket not found");

        // Authorization handled at controller level

        return await _context.TicketComments
            .Where(c => c.TicketId == ticketId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new TicketCommentDto
            {
                Id = c.TicketId,
                Name = c.CreatedByUser.FullName,
                Comment = c.Comment,
                CreatedByUserId = c.CreatedByUserId,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }


    // -------------------------
    // COMMENT PERMISSIONS
    // -------------------------
    private static bool CanUserComment(Ticket ticket, int userId, User user)
    {
        // EndUser → own ticket
        // SupportAgent → assigned ticket
        // SupportManager → handled via controller role check later (next step)

        return ticket.CreatedByUserId == userId
               || ticket.Assignments.Any(a => a.AssignedToUserId == userId || user.Id == userId );
    }
}
