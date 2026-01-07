namespace Application.DTOs.Tickets;

public class CreateTicketRequestDto
{
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int CategoryId { get; set; }
    public int PriorityId { get; set; }
}
