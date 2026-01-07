namespace Application.DTOs.Reports;

public class UserDashboardDto
{
    public int MyOpenTickets { get; set; }
    public int MyTotalTickets { get; set; }

    // reuse existing generic DTO
    public List<TicketCountDto> TicketsByStatus { get; set; } = [];
}
