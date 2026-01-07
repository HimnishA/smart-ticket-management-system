using Application.DTOs.SupportManager;
using Application.Interfaces.SupportManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.SupportManager;

[ApiController]
[Route("api/support-manager/queue")]
[Authorize(Roles = "SupportManager")]
public class SupportManagerQueueController : ControllerBase
{
    private readonly ISupportManagerQueueService _service;

    public SupportManagerQueueController(ISupportManagerQueueService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetQueue(
        [FromQuery] SupportManagerQueueQueryDto query)
    {
        var result = await _service.GetQueueAsync(query);
        return Ok(result);
    }
}
