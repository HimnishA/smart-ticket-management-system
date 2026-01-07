namespace Application.DTOs.Tickets;

public class TicketActivityDto
{
    public string Action { get; set; } = null!;
    public string? FieldName { get; set; }
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public int PerformedByUserId { get; set; }
    public DateTime PerformedAt { get; set; }
}
