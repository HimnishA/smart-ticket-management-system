namespace Application.DTOs.Tickets;

public class TicketDetailsDto
{
    public int TicketId { get; set; }

    // Core Info
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Status { get; set; } = null!;

    // Classification
    public string Category { get; set; } = null!;
    public string Priority { get; set; } = null!;

    // Assignment
    public int? AssignedToUserId { get; set; }
    public string? AssignedToName { get; set; }

    // SLA
    public string SlaName { get; set; } = null!;
    public bool IsSlaBreached { get; set; }

    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public bool IsEscalated { get; set; }
    public DateTime? EscalatedAt { get; set; }

}
