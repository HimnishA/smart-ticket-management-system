namespace Application.DTOs.Tickets;

public class TicketCommentDto
{
    public int Id { get; set; }
    public string Comment { get; set; } = null!;
    public int CreatedByUserId { get; set; }
    public string? Name { get; set; }
    public DateTime CreatedAt { get; set; }
}
