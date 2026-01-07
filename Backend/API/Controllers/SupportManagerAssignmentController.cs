using Application.DTOs.SupportManager;
using Application.Interfaces.SupportManager;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.SupportManager;

[ApiController]
[Route("api/support-manager/assignments")]
[Authorize(Roles = "SupportManager")]
public class SupportManagerAssignmentController : ControllerBase
{
    private readonly ISupportManagerAssignmentService _service;

    public SupportManagerAssignmentController(
        ISupportManagerAssignmentService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> AssignTicket(
        [FromBody] AssignTicketDto dto)
    {
        var performedByUserId = int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        await _service.AssignTicketAsync(
            dto.TicketId,
            dto.AssignToUserId,
            performedByUserId);

        return NoContent();
    }
}
