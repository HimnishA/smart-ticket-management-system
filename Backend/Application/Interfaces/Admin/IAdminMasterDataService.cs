using Application.DTOs.Admin;

namespace Application.Interfaces.Admin;


public interface IAdminMasterDataService
{
    // Categories
    Task CreateCategoryAsync(CreateCategoryDto dto);
    Task DeactivateCategoryAsync(int categoryId);

    // Priorities
    Task CreatePriorityAsync(CreatePriorityDto dto);
    Task DeactivatePriorityAsync(int priorityId);

    // SLA Policies
    Task CreateSlaAsync(CreateSlaDto dto);
    Task DeactivateSlaAsync(int slaId);

    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync();
    Task<IReadOnlyList<PriorityDto>> GetPrioritiesAsync();
    Task<IReadOnlyList<SlaPolicyDto>> GetSlasAsync();
    
}

