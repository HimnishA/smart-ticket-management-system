namespace Application.DTOs.SupportManager;

public class SupportManagerQueueQueryDto
{
    public string? Status { get; set; }
    public int? CategoryId { get; set; }
    public int? PriorityId { get; set; }

    public string SortBy { get; set; } = "CreatedAt";
    public string SortDirection { get; set; } = "desc";

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
