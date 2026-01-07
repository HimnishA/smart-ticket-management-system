namespace Application.DTOs.SupportManager;

public class SupportManagerTicketQueueItemDto
{
    public int TicketId { get; set; }
    public string Title { get; set; } = null!;

    public string Category { get; set; } = null!;
    public string Priority { get; set; } = null!;

    public string Status { get; set; } = null!;

    public int? AssignedToUserId { get; set; }
    public string? AssignedToName { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? SlaDeadline { get; set; }

    public bool IsSlaBreached { get; set; }
    public bool IsEscalated { get; set; }

}
