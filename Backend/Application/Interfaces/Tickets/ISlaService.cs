using Domain.Entities;
namespace Application.Interfaces.Tickets;

public interface ISlaService
{
    DateTime CalculateSlaDeadline(DateTime startTime, SLAPolicy slaPolicy);
    bool IsSlaBreached(DateTime startTime, SLAPolicy slaPolicy);

}
