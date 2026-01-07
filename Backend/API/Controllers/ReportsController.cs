using Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Roles = "SupportManager")]
public class ReportsController : ControllerBase
{
    private readonly IReportingService _reportingService;

    public ReportsController(IReportingService reportingService)
    {
        _reportingService = reportingService;
    }

    [HttpGet("sla-compliance")]
    public async Task<IActionResult> GetSlaCompliance()
        => Ok(await _reportingService.GetSlaComplianceReportAsync());

    [HttpGet("tickets-by-status")]
    public async Task<IActionResult> GetTicketsByStatus()
        => Ok(await _reportingService.GetTicketsByStatusAsync());

    [HttpGet("tickets-by-priority")]
    public async Task<IActionResult> GetTicketsByPriority()
        => Ok(await _reportingService.GetTicketsByPriorityAsync());

    [HttpGet("tickets-by-category")]
    public async Task<IActionResult> GetTicketsByCategory()
        => Ok(await _reportingService.GetTicketsByCategoryAsync());

    [HttpGet("average-resolution-time")]
    public async Task<IActionResult> GetAverageResolutionTime()
        => Ok(await _reportingService.GetAverageResolutionTimeAsync());

    [HttpGet("agent-workload")]
    public async Task<IActionResult> GetAgentWorkload()
        => Ok(await _reportingService.GetAgentWorkloadAsync());
}
