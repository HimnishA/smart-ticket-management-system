using Application.Interfaces.SupportManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.SupportManager;

[ApiController]
[Route("api/support-manager/agents")]
[Authorize(Roles = "SupportManager")]
public class SupportAgentLookupController : ControllerBase
{
    private readonly ISupportAgentLookupService _service;

    public SupportAgentLookupController(
        ISupportAgentLookupService service)
    {
        _service = service;
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableAgents()
    {
        var agents = await _service.GetAvailableAgentsAsync();
        return Ok(agents);
    }
}
