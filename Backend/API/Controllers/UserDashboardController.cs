using Application.Interfaces.Reports;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Route("api/user/dashboard")]
[Authorize(Roles = "EndUser")]
public class UserDashboardController : ControllerBase
{
    private readonly IReportingService _reportingService;

    public UserDashboardController(IReportingService reportingService)
    {
        _reportingService = reportingService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _reportingService.GetUserDashboardAsync(userId);
        return Ok(result);
    }
}
