using Application.DTOs.Common;
using Application.DTOs.SupportManager;

namespace Application.Interfaces.SupportManager;

public interface ISupportManagerQueueService
{
    Task<PagedResultDto<SupportManagerTicketQueueItemDto>> GetQueueAsync(
        SupportManagerQueueQueryDto query
    );
}
