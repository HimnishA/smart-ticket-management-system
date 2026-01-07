namespace Application.DTOs.Admin;

public class SlaPolicyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int ResolutionHours { get; set; }
    public bool IsActive { get; set; }
}
