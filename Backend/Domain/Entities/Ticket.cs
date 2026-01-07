using Domain.Enums;

namespace Domain.Entities;

public class Ticket
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;

    public TicketStatus Status { get; set; }

    // -------------------------
    // Category
    // -------------------------
    public int CategoryId { get; set; }
    public TicketCategory Category { get; set; } = null!;

    // -------------------------
    // Priority
    // -------------------------
    public int PriorityId { get; set; }
    public TicketPriority Priority { get; set; } = null!;

    // -------------------------
    // SLA
    // -------------------------
    public int SLAId { get; set; }
    public SLAPolicy SLA { get; set; } = null!;

    // -------------------------
    // Created By (User)
    // -------------------------
    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    // -------------------------
    // Assigned To (User)
    // -------------------------
    public int? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }

    // -------------------------
    // Timestamps
    // -------------------------
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? ReopenedAt { get; set; }

    //Escalation
    
    public bool IsEscalated { get; set; } = false;
    public DateTime? EscalatedAt { get; set; }


    // -------------------------
    // Navigation Collections
    // -------------------------
    public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
    public ICollection<TicketAssignment> Assignments { get; set; } = new List<TicketAssignment>();
    public ICollection<TicketActivity> Activities { get; set; } = new List<TicketActivity>();
}
