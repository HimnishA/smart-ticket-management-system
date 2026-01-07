namespace Domain.Entities;

public class SLAPolicy
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int ResolutionHours { get; set; }

    public bool IsActive { get; set; } = true;
    public DateTime? DeactivatedAt { get; set; }


    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
