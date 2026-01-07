namespace Application.DTOs.Admin;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public bool IsActive { get; set; }
}
