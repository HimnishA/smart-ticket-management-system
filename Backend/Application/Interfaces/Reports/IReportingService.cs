using Application.DTOs.Reports;

namespace Application.Interfaces.Reports;

public interface IReportingService
{
    // -------------------------
    // MANAGER REPORTS (PHASE 6)
    // -------------------------
    Task<SlaComplianceDto> GetSlaComplianceReportAsync();
    Task<List<TicketCountDto>> GetTicketsByStatusAsync();
    Task<List<TicketCountDto>> GetTicketsByPriorityAsync();
    Task<List<TicketCountDto>> GetTicketsByCategoryAsync();
    Task<AverageResolutionTimeDto> GetAverageResolutionTimeAsync();
    Task<List<AgentWorkloadDto>> GetAgentWorkloadAsync();
    Task<UserDashboardDto> GetUserDashboardAsync(int userId);


    // -------------------------
    // SUPPORT AGENT DASHBOARD
    // -------------------------
    Task<AgentDashboardDto> GetAgentDashboardAsync(int agentUserId);
}
