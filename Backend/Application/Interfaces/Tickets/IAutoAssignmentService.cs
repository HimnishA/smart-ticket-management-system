namespace Application.Interfaces.Tickets;

public interface IAutoAssignmentService
{
    Task<int?> GetAvailableAgentAsync();
}
