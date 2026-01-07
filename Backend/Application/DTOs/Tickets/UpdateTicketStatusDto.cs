using Domain.Enums;

namespace Application.DTOs.Tickets;

public class UpdateTicketStatusDto
{
    public int TicketId { get; set; }
    public TicketStatus NewStatus { get; set; }
}
