using Application.Interfaces.Tickets;
using Domain.Entities;

namespace Application.Services.Tickets;

public class SlaService : ISlaService
{
    public DateTime CalculateSlaDeadline(DateTime startTime, SLAPolicy slaPolicy)
    {
        return startTime.AddHours(slaPolicy.ResolutionHours);
    }

    public bool IsSlaBreached(DateTime startTime, SLAPolicy slaPolicy)
    {
        var deadline = CalculateSlaDeadline(startTime, slaPolicy);
        return DateTime.UtcNow > deadline;
    }
}
