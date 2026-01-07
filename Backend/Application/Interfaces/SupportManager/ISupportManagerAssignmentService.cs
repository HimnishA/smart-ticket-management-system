namespace Application.Interfaces.SupportManager;

public interface ISupportManagerAssignmentService
{
    Task AssignTicketAsync(int ticketId, int assignToUserId, int performedByUserId);
}
