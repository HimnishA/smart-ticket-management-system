namespace Application.DTOs.Tickets;

public class TicketListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public DateTime? EscalatedAt { get; set; }
    public string? IsEscalated { get; set; } = string.Empty;
}

