using Application.DTOs.Common;
using Application.DTOs.SupportManager;
using Application.Interfaces.SupportManager;
using Application.Interfaces.Tickets;
using Domain.Enums;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.SupportManager;

public class SupportManagerQueueService : ISupportManagerQueueService
{
    private readonly ApplicationDbContext _context;
    private readonly ISlaService _slaService;

    public SupportManagerQueueService(
        ApplicationDbContext context,
        ISlaService slaService)
    {
        _context = context;
        _slaService = slaService;
    }

    public async Task<PagedResultDto<SupportManagerTicketQueueItemDto>> GetQueueAsync(
        SupportManagerQueueQueryDto query)
    {
        // -------------------------
        // BASE QUERY (SQL)
        // -------------------------
        var baseQuery = _context.Tickets
            .AsNoTracking()
            .Include(t => t.Category)
            .Include(t => t.Priority)
            .Include(t => t.SLA)
            .Include(t => t.AssignedToUser)
            .Where(t =>
                t.Status == TicketStatus.Created ||
                t.Status == TicketStatus.Assigned ||
                t.Status == TicketStatus.InProgress
            );

        // -------------------------
        // OPTIONAL FILTERS
        // -------------------------
        if (!string.IsNullOrWhiteSpace(query.Status) &&
            Enum.TryParse<TicketStatus>(query.Status, true, out var status))
        {
            baseQuery = baseQuery.Where(t => t.Status == status);
        }

        if (query.CategoryId.HasValue)
            baseQuery = baseQuery.Where(t => t.CategoryId == query.CategoryId);

        if (query.PriorityId.HasValue)
            baseQuery = baseQuery.Where(t => t.PriorityId == query.PriorityId);

        // -------------------------
        // SORTING (SQL)
        // -------------------------
        baseQuery = query.SortBy.ToLower() switch
        {
            "priority" => query.SortDirection == "asc"
                ? baseQuery.OrderBy(t => t.Priority.Name)
                : baseQuery.OrderByDescending(t => t.Priority.Name),

            "status" => query.SortDirection == "asc"
                ? baseQuery.OrderBy(t => t.Status)
                : baseQuery.OrderByDescending(t => t.Status),

            _ => query.SortDirection == "asc"
                ? baseQuery.OrderBy(t => t.CreatedAt)
                : baseQuery.OrderByDescending(t => t.CreatedAt)
        };

        // -------------------------
        // PAGINATION METADATA
        // -------------------------
        var totalCount = await baseQuery.CountAsync();

        // -------------------------
        // MATERIALIZE (IMPORTANT)
        // -------------------------
        var tickets = await baseQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

        // -------------------------
        // DTO MAPPING (IN-MEMORY)
        // -------------------------
        var items = tickets.Select(t =>
        {
            var slaDeadline = _slaService.CalculateSlaDeadline(
                t.CreatedAt,
                t.SLA
            );

            return new SupportManagerTicketQueueItemDto
            {
                TicketId = t.Id,
                Title = t.Title,

                Category = t.Category.Name,
                Priority = t.Priority.Name,
                Status = t.Status.ToString(),

                AssignedToUserId = t.AssignedToUserId,
                AssignedToName = t.AssignedToUser != null
                ? t.AssignedToUser.FullName
                : null,
                CreatedAt = t.CreatedAt,
                SlaDeadline = slaDeadline,

                IsSlaBreached =
                    t.Status != TicketStatus.Resolved &&
                    t.Status != TicketStatus.Closed &&
                    _slaService.IsSlaBreached(t.CreatedAt, t.SLA),

                IsEscalated = t.IsEscalated

            };
        }).ToList();

        // -------------------------
        // RESULT
        // -------------------------
        return new PagedResultDto<SupportManagerTicketQueueItemDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}
