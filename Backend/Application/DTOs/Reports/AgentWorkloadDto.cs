namespace Application.DTOs.Reports;

public class AgentWorkloadDto
{
    public int AgentId { get; set; }
    public string AgentName { get; set; } = string.Empty;
    public int ActiveTicketCount { get; set; }
}
