using Application.Interfaces.Tickets;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Tickets;

public class AutoAssignmentService : IAutoAssignmentService
{
    private readonly ApplicationDbContext _context;

    public AutoAssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int?> GetAvailableAgentAsync()
    {
        // 1️⃣ Get Support Agent role
        var agentRoleId = await _context.Roles
            .Where(r => r.Name == "SupportAgent")
            .Select(r => r.Id)
            .FirstOrDefaultAsync();

        // No SupportAgent role configured
        if (agentRoleId == 0)
            return null;

        // 2️⃣ Get agents with that role
        var agents = await _context.UserRoles
            .Where(ur => ur.RoleId == agentRoleId)
            .Select(ur => ur.UserId)
            .ToListAsync();

        if (!agents.Any())
            return null;

        // 3️⃣ Get active ticket counts
        var agentLoad = await _context.Tickets
            .Where(t =>
                t.AssignedToUserId != null &&
                agents.Contains(t.AssignedToUserId.Value) &&
                t.Status != Domain.Enums.TicketStatus.Resolved &&
                t.Status != Domain.Enums.TicketStatus.Closed
            )
            .GroupBy(t => t.AssignedToUserId)
            .Select(g => new
            {
                AgentId = g.Key!.Value,
                ActiveTickets = g.Count()
            })
            .ToListAsync();

        // 4️⃣ Select least-loaded agent
        var leastLoadedAgent = agents
            .Select(agentId => new
            {
                AgentId = agentId,
                Count = agentLoad.FirstOrDefault(a => a.AgentId == agentId)?.ActiveTickets ?? 0
            })
            .OrderBy(a => a.Count)
            .FirstOrDefault();

        return leastLoadedAgent?.AgentId;
    }
}
