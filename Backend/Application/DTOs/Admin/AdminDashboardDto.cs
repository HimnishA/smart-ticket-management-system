namespace Application.DTOs.Admin;

public class AdminDashboardDto
{
    public int TotalUsers { get; set; }
    public int PendingUserApprovals { get; set; }

    public int ActiveCategories { get; set; }
    public int InactiveCategories { get; set; }

    public int ActivePriorities { get; set; }
    public int InactivePriorities { get; set; }

    public int ActiveSlaPolicies { get; set; }
    public int InactiveSlaPolicies { get; set; }
}
