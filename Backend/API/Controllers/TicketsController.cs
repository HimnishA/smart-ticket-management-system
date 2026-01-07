// using Application.DTOs.Tickets;
// using Application.Interfaces.Tickets;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using API.Extensions;

// namespace API.Controllers;

// [ApiController]
// [Route("api/tickets")]
// [Authorize]
// public class TicketsController : ControllerBase
// {
//     private readonly ITicketService _service;

//     public TicketsController(ITicketService service)
//     {
//         _service = service;
//     }

//     // -------------------------
//     // CREATE (END USER)
//     // -------------------------

//     [HttpPost]
//     [Authorize(Roles = "EndUser")]
//     public async Task<IActionResult> Create(CreateTicketRequestDto dto)
//     {
//         var result = await _service.CreateTicketAsync(dto, User.GetUserId());
//         return Ok(result);
//     }

//     //Escalate End User
//     [HttpPost("{ticketId}/escalate")]
//     [Authorize(Roles = "EndUser")]
//     public async Task<IActionResult> Escalate(int ticketId)
//     {
//         await _service.EscalateTicketAsync(ticketId, User.GetUserId());
//         return NoContent();
//     }


//     // -------------------------
//     // MY TICKETS (ALL ROLES)
//     // -------------------------

//     [HttpGet("my")]
//     public async Task<IActionResult> GetMyTickets()
//     {
//         var userId = User.GetUserId();
//         var role = User.GetUserRole(); // extension method

//         var tickets = await _service.GetMyTicketsAsync(userId, role);
//         return Ok(tickets);
//     }

//     // -------------------------
//     // TICKET DETAILS (ALL ROLES)
//     // -------------------------
//     [HttpGet("{ticketId:int}")]
//     [Authorize(Roles = "EndUser,SupportAgent,SupportManager")]
//     public async Task<IActionResult> GetById(int ticketId)
//     {
//         var userId = User.GetUserId();
//         var role = User.GetUserRole();

//         var ticket = await _service.GetTicketByIdAsync(ticketId, userId, role);
//         return Ok(ticket);
//     }


//     // -------------------------
//     // END USER ACTIONS
//     // -------------------------

//     [HttpPost("{ticketId}/cancel")]
//     [Authorize(Roles = "EndUser")]
//     public async Task<IActionResult> Cancel(int ticketId)
//     {
//         await _service.CancelTicketAsync(ticketId, User.GetUserId());
//         return NoContent();
//     }

//     [HttpPost("{ticketId}/reopen")]
//     [Authorize(Roles = "EndUser")]
//     public async Task<IActionResult> Reopen(int ticketId)
//     {
//         await _service.ReopenTicketAsync(ticketId, User.GetUserId());
//         return NoContent();
//     }

//     // -------------------------
//     // SUPPORT MANAGER
//     // -------------------------

//     [HttpPost("assign")]
//     [Authorize(Roles = "SupportManager")]
//     public async Task<IActionResult> Assign(AssignTicketRequestDto dto)
//     {
//         await _service.AssignTicketAsync(dto, User.GetUserId());
//         return NoContent();
//     }

//     // -------------------------
//     // SUPPORT AGENT
//     // -------------------------

//     [HttpPut("status")]
//     [Authorize(Roles = "SupportAgent")]
//     public async Task<IActionResult> UpdateStatus(UpdateTicketStatusDto dto)
//     {
//         await _service.UpdateTicketStatusAsync(dto, User.GetUserId());
//         return NoContent();
//     }
// }


using Application.DTOs.Tickets;
using Application.Interfaces.Tickets;
using Application.Interfaces.Admin;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;

namespace API.Controllers;

[ApiController]
[Route("api/tickets")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly IAdminMasterDataService _masterDataService;

    public TicketsController(
        ITicketService ticketService,
        IAdminMasterDataService masterDataService)
    {
        _ticketService = ticketService;
        _masterDataService = masterDataService;
    }


    // =====================================================
    // CREATE TICKET (END USER)
    // =====================================================

    [HttpPost]
    [Authorize(Roles = "EndUser")]
    public async Task<IActionResult> Create(CreateTicketRequestDto dto)
    {
        var result = await _ticketService.CreateTicketAsync(dto, User.GetUserId());
        return Ok(result);
    }

    // =====================================================
    // ESCALATE TICKET (END USER ONLY)
    // =====================================================

    [HttpPost("{ticketId:int}/escalate")]
    [Authorize(Roles = "EndUser")]
    public async Task<IActionResult> Escalate(int ticketId)
    {
        await _ticketService.EscalateTicketAsync(ticketId, User.GetUserId());
        return NoContent();
    }

    // =====================================================
    // MY TICKETS (ALL ROLES)
    // =====================================================

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTickets()
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var tickets = await _ticketService.GetMyTicketsAsync(userId, role);
        return Ok(tickets);
    }

    // =====================================================
    // TICKET DETAILS (END USER / AGENT / MANAGER)
    // =====================================================

    [HttpGet("{ticketId:int}")]
    [Authorize(Roles = "EndUser,SupportAgent,SupportManager")]
    public async Task<IActionResult> GetById(int ticketId)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var ticket = await _ticketService.GetTicketByIdAsync(ticketId, userId, role);
        return Ok(ticket);
    }

    // =====================================================
    // LOOKUP DATA (READ-ONLY, ALL ROLES)
    // =====================================================
    

    [HttpGet("categories")]
    [Authorize(Roles = "EndUser,SupportAgent,SupportManager,Admin")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _masterDataService.GetCategoriesAsync();

        var activeCategories = categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name);

        return Ok(activeCategories);
    }

    [HttpGet("priorities")]
    [Authorize(Roles = "EndUser,SupportAgent,SupportManager,Admin")]
    public async Task<IActionResult> GetPriorities()
    {
        var priorities = await _masterDataService.GetPrioritiesAsync();

        var activePriorities = priorities
            .Where(p => p.IsActive)
            .OrderBy(p => p.Id);

        return Ok(activePriorities);
    }

    // =====================================================
    // END USER ACTIONS
    // =====================================================

    [HttpPost("{ticketId:int}/cancel")]
    [Authorize(Roles = "EndUser")]
    public async Task<IActionResult> Cancel(int ticketId)
    {
        await _ticketService.CancelTicketAsync(ticketId, User.GetUserId());
        return NoContent();
    }

    [HttpPost("{ticketId:int}/reopen")]
    [Authorize(Roles = "EndUser")]
    public async Task<IActionResult> Reopen(int ticketId)
    {
        await _ticketService.ReopenTicketAsync(ticketId, User.GetUserId());
        return NoContent();
    }

    // =====================================================
    // SUPPORT MANAGER
    // =====================================================

    [HttpPost("assign")]
    [Authorize(Roles = "SupportManager")]
    public async Task<IActionResult> Assign(AssignTicketRequestDto dto)
    {
        await _ticketService.AssignTicketAsync(dto, User.GetUserId());
        return NoContent();
    }

    // =====================================================
    // SUPPORT AGENT
    // =====================================================

    [HttpPut("status")]
    [Authorize(Roles = "SupportAgent")]
    public async Task<IActionResult> UpdateStatus(UpdateTicketStatusDto dto)
    {
        await _ticketService.UpdateTicketStatusAsync(dto, User.GetUserId());
        return NoContent();
    }


    [HttpGet("{ticketId:int}/activities")]
    [Authorize(Roles = "EndUser,SupportAgent,SupportManager")]
    public async Task<IActionResult> GetActivities(int ticketId)
    {
        var userId = User.GetUserId();
        var role = User.GetUserRole();

        var activities = await _ticketService.GetTicketActivitiesAsync(
            ticketId, userId, role);

        return Ok(activities);
    }

}
