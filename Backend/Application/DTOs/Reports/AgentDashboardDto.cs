namespace Application.DTOs.Reports;

public class AgentDashboardDto
{
    public int MyActiveTickets { get; set; }
    public int MyTotalTickets { get; set; }

    public List<TicketsByStatusDto> TicketsByStatus { get; set; } = [];
    public List<TicketsByPriorityDto> TicketsByPriority { get; set; } = [];
    public List<AgentTicketDto> MyTickets { get; set; } = [];
}

public class TicketsByStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class TicketsByPriorityDto
{
    public string Priority { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class AgentTicketDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
