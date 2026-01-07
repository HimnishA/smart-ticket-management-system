namespace Domain.Entities;

public class TicketAssignment
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    // Assigned TO
    public int AssignedToUserId { get; set; }
    public User AssignedToUser { get; set; } = null!;

    // Assigned BY
    public int AssignedByUserId { get; set; }
    public User AssignedByUser { get; set; } = null!;

    public DateTime AssignedAt { get; set; }
}
