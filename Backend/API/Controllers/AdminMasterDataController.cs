using Application.DTOs.Admin;
using Application.Interfaces.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/admin/master-data")]
[Authorize(Roles = "Admin")]
public class AdminMasterDataController : ControllerBase
{
    private readonly IAdminMasterDataService _service;

    public AdminMasterDataController(IAdminMasterDataService service)
    {
        _service = service;
    }

    // -------------------------
    // CATEGORIES
    // -------------------------

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _service.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory(CreateCategoryDto dto)
    {
        await _service.CreateCategoryAsync(dto);
        return NoContent();
    }

    [HttpPatch("categories/{id}/deactivate")]
    public async Task<IActionResult> DeactivateCategory(int id)
    {
        await _service.DeactivateCategoryAsync(id);
        return NoContent();
    }

    // -------------------------
    // PRIORITIES
    // -------------------------

    [HttpGet("priorities")]
    public async Task<IActionResult> GetPriorities()
    {
        var priorities = await _service.GetPrioritiesAsync();
        return Ok(priorities);
    }

    [HttpPost("priorities")]
    public async Task<IActionResult> CreatePriority(CreatePriorityDto dto)
    {
        await _service.CreatePriorityAsync(dto);
        return NoContent();
    }

    [HttpPatch("priorities/{id}/deactivate")]
    public async Task<IActionResult> DeactivatePriority(int id)
    {
        await _service.DeactivatePriorityAsync(id);
        return NoContent();
    }

    // -------------------------
    // SLA POLICIES
    // -------------------------

    [HttpGet("slas")]
    public async Task<IActionResult> GetSlas()
    {
        var slas = await _service.GetSlasAsync();
        return Ok(slas);
    }

    [HttpPost("slas")]
    public async Task<IActionResult> CreateSla(CreateSlaDto dto)
    {
        await _service.CreateSlaAsync(dto);
        return NoContent();
    }

    [HttpPatch("slas/{id}/deactivate")]
    public async Task<IActionResult> DeactivateSla(int id)
    {
        await _service.DeactivateSlaAsync(id);
        return NoContent();
    }
}
