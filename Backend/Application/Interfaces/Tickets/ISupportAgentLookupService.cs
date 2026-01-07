using Application.DTOs.SupportManager;

namespace Application.Interfaces.SupportManager;

public interface ISupportAgentLookupService
{
    Task<IReadOnlyList<AvailableSupportAgentDto>> GetAvailableAgentsAsync();
}
