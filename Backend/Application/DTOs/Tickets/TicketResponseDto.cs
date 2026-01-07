using Domain.Enums;

namespace Application.DTOs.Tickets;

public class TicketResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public TicketStatus Status { get; set; }
    public int PriorityId { get; set; }
    public int CategoryId { get; set; }
    public int? AssignedToUserId { get; set; }
    public DateTime CreatedAt { get; set; }
}
