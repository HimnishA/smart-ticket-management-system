using Application.DTOs.Tickets;

namespace Application.Interfaces.Tickets;

public interface ITicketCommentService
{
    Task AddCommentAsync(
        int ticketId,
        int userId,
        AddTicketCommentRequest request);

    Task<IReadOnlyList<TicketCommentDto>> GetCommentsAsync(
        int ticketId,
        int userId);
}
