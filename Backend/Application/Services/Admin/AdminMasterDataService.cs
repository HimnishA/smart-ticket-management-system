using Application.DTOs.Admin;
using Application.Exceptions;
using Application.Interfaces.Admin;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Admin;

public sealed class AdminMasterDataService : IAdminMasterDataService
{
    private readonly ApplicationDbContext _context;

    public AdminMasterDataService(ApplicationDbContext context)
    {
        _context = context;
    }

    // -------------------------
    // CATEGORIES
    // -------------------------
    public async Task CreateCategoryAsync(CreateCategoryDto dto)
    {
        if (await _context.TicketCategories.AnyAsync(c => c.Name == dto.Name))
            throw new BusinessRuleViolationException("Category already exists");

        _context.TicketCategories.Add(new()
        {
            Name = dto.Name,
            Description = dto.Description,
            IsActive = true
        });

        await _context.SaveChangesAsync();
    }

    public async Task DeactivateCategoryAsync(int categoryId)
    {
        var category = await _context.TicketCategories.FindAsync(categoryId)
            ?? throw new BusinessRuleViolationException("Category not found");

        if (!category.IsActive)
            throw new BusinessRuleViolationException("Category already inactive");

        category.IsActive = false;
        category.DeactivatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    // -------------------------
    // PRIORITIES
    // -------------------------
    public async Task CreatePriorityAsync(CreatePriorityDto dto)
    {
        if (await _context.TicketPriorities.AnyAsync(p => p.Name == dto.Name))
            throw new BusinessRuleViolationException("Priority already exists");

        _context.TicketPriorities.Add(new()
        {
            Name = dto.Name,
            Level = dto.Level,
            IsActive = true
        });

        await _context.SaveChangesAsync();
    }

    public async Task DeactivatePriorityAsync(int priorityId)
    {
        var priority = await _context.TicketPriorities.FindAsync(priorityId)
            ?? throw new BusinessRuleViolationException("Priority not found");

        if (!priority.IsActive)
            throw new BusinessRuleViolationException("Priority already inactive");

        priority.IsActive = false;
        priority.DeactivatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    // -------------------------
    // SLA POLICIES
    // -------------------------
    public async Task CreateSlaAsync(CreateSlaDto dto)
    {
        if (await _context.SLAPolicies.AnyAsync(s => s.Name == dto.Name))
            throw new BusinessRuleViolationException("SLA policy already exists");

        _context.SLAPolicies.Add(new()
        {
            Name = dto.Name,
            ResolutionHours = dto.ResolutionHours,
            IsActive = true
        });

        await _context.SaveChangesAsync();
    }

    public async Task DeactivateSlaAsync(int slaId)
    {
        var sla = await _context.SLAPolicies.FindAsync(slaId)
            ?? throw new BusinessRuleViolationException("SLA policy not found");

        if (!sla.IsActive)
            throw new BusinessRuleViolationException("SLA already inactive");

        sla.IsActive = false;
        sla.DeactivatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync()
    {
        return await _context.TicketCategories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                IsActive = c.IsActive
            })
            .ToListAsync();
    }

    public async Task<IReadOnlyList<PriorityDto>> GetPrioritiesAsync()
    {
        return await _context.TicketPriorities
            .OrderBy(p => p.Name)
            .Select(p => new PriorityDto
            {
                Id = p.Id,
                Name = p.Name,
                IsActive = p.IsActive
            })
            .ToListAsync();
    }

    public async Task<IReadOnlyList<SlaPolicyDto>> GetSlasAsync()
    {
        return await _context.SLAPolicies
            .OrderBy(s => s.ResolutionHours)
            .Select(s => new SlaPolicyDto
            {
                Id = s.Id,
                Name = s.Name,
                ResolutionHours = s.ResolutionHours,
                IsActive = s.IsActive
            })
            .ToListAsync();
    }

    


}
