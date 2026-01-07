using Application.DTOs.Tickets;

namespace Application.Interfaces.Tickets;

public interface ITicketService
{
    Task<TicketResponseDto> CreateTicketAsync(CreateTicketRequestDto dto, int userId);
    Task AssignTicketAsync(AssignTicketRequestDto dto, int performedByUserId);
    Task UpdateTicketStatusAsync(UpdateTicketStatusDto dto, int performedByUserId);
    Task CancelTicketAsync(int ticketId, int performedByUserId);
    Task ReopenTicketAsync(int ticketId, int performedByUserId);
    // EXISTING — do NOT touch
    Task<IEnumerable<TicketResponseDto>> GetMyTicketsAsync(int userId);
     // NEW — role-aware
    Task<IEnumerable<TicketListItemDto>> GetMyTicketsAsync(int userId, string role);

    Task<IEnumerable<TicketResponseDto>> GetAssignedTicketsAsync(int agentId);

    Task<TicketDetailsDto> GetTicketByIdAsync(
    int ticketId,
    int userId,
    string role);

    Task EscalateTicketAsync(int ticketId, int userId);

    Task<IReadOnlyList<TicketActivityDto>> GetTicketActivitiesAsync(
        int ticketId,
        int userId,
        string role
    );


    
}
