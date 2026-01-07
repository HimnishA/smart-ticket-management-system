using Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/agent/dashboard")]
[Authorize(Roles = "SupportAgent")]
public class AgentDashboardController : ControllerBase
{
    private readonly IReportingService _reportingService;

    public AgentDashboardController(IReportingService reportingService)
    {
        _reportingService = reportingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAgentDashboard()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized();

        int agentUserId = int.Parse(userIdClaim.Value);

        var result = await _reportingService.GetAgentDashboardAsync(agentUserId);

        return Ok(result);
    }
}
