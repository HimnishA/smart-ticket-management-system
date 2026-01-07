using Application.DTOs.Tickets;
using Application.Interfaces.Tickets;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/tickets/{ticketId:int}/comments")]
[Authorize(Roles = "EndUser,SupportAgent,SupportManager")]
public class TicketCommentsController : ControllerBase
{
    private readonly ITicketCommentService _service;

    public TicketCommentsController(ITicketCommentService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> AddComment(
        int ticketId,
        [FromBody] AddTicketCommentRequest request)
    {
        var userId = User.GetUserId();
        await _service.AddCommentAsync(ticketId, userId, request);
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetComments(int ticketId)
    {
        var userId = User.GetUserId();
        var comments = await _service.GetCommentsAsync(ticketId, userId);
        return Ok(comments);
    }
}
