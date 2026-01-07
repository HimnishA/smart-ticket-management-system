using Application.DTOs.Admin;
using Application.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;

namespace API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Roles = "Admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _service;

    public AdminUsersController(IAdminUserService service)
    {
        _service = service;
    }

    // -------------------------
    // GET PENDING USERS
    // -------------------------
    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingUsers()
        => Ok(await _service.GetPendingUsersAsync());

    // -------------------------
    // APPROVE USER
    // -------------------------
    [HttpPost("{userId}/approve")]
    public async Task<IActionResult> ApproveUser(
        int userId,
        ApproveUserRequestDto dto)
    {
        await _service.ApproveUserAsync(
            userId,
            dto.RoleIds,
            User.GetUserId());

        return NoContent();
    }

    // -------------------------
    // REJECT USER
    // -------------------------
    [HttpPost("{userId}/reject")]
    public async Task<IActionResult> RejectUser(int userId)
    {
        await _service.RejectUserAsync(userId, User.GetUserId());
        return NoContent();
    }
}
