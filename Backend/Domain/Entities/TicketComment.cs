namespace Domain.Entities;

public class TicketComment
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public string Comment { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
