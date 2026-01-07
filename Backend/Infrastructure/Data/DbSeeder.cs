using Domain.Entities;
using Microsoft.EntityFrameworkCore;

// using BCrypt.Net;


namespace Infrastructure.Data;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        // Ensure DB exists
        context.Database.Migrate();

        SeedRoles(context);
        SeedUsers(context);
        SeedTicketPriorities(context);
        SeedSLAPolicies(context);
        SeedTicketCategories(context);

        context.SaveChanges();
    }

    // -------------------------
    // Roles
    // -------------------------
    private static void SeedRoles(ApplicationDbContext context)
    {
        if (context.Roles.Any()) return;

        var roles = new List<Role>
        {
            new() { Name = "Admin" },
            new() { Name = "SupportManager" },
            new() { Name = "SupportAgent" },
            new() { Name = "EndUser" }
        };

        context.Roles.AddRange(roles);
    }

    // -------------------------
    // Users (System seed)
    // -------------------------
    private static void SeedUsers(ApplicationDbContext context)
    {
        if (context.Users.Any()) return;

        var now = DateTime.UtcNow;

        // -------------------------
        // Create system-approved users
        // -------------------------
        var admin = new User
        {
            FullName = "System Admin",
            Email = "admin@system.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),

            IsActive = true,
            IsApproved = true,              // ✅ PRE-APPROVED
            ApprovedAt = now,
            ApprovedByUserId = null,        // system-approved
            CreatedAt = now
        };

        var manager = new User
        {
            FullName = "Support Manager",
            Email = "manager@system.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123"),

            IsActive = true,
            IsApproved = true,
            ApprovedAt = now,
            ApprovedByUserId = null,
            CreatedAt = now
        };

        var agent = new User
        {
            FullName = "Support Agent",
            Email = "agent@system.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Agent@123"),

            IsActive = true,
            IsApproved = true,
            ApprovedAt = now,
            ApprovedByUserId = null,
            CreatedAt = now
        };

        var endUser = new User
        {
            FullName = "End User",
            Email = "user@system.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),

            IsActive = true,
            IsApproved = true,
            ApprovedAt = now,
            ApprovedByUserId = null,
            CreatedAt = now
        };

        context.Users.AddRange(admin, manager, agent, endUser);
        context.SaveChanges(); // 🔑 generate IDs

        // -------------------------
        // Fetch roles
        // -------------------------
        var adminRole = context.Roles.Single(r => r.Name == "Admin");
        var managerRole = context.Roles.Single(r => r.Name == "SupportManager");
        var agentRole = context.Roles.Single(r => r.Name == "SupportAgent");
        var endUserRole = context.Roles.Single(r => r.Name == "EndUser");

        // -------------------------
        // Map users to roles
        // -------------------------
        context.UserRoles.AddRange(
            new UserRole { UserId = admin.Id, RoleId = adminRole.Id },
            new UserRole { UserId = manager.Id, RoleId = managerRole.Id },
            new UserRole { UserId = agent.Id, RoleId = agentRole.Id },
            new UserRole { UserId = endUser.Id, RoleId = endUserRole.Id }
        );
    }


    // -------------------------
    // Ticket Priorities
    // -------------------------
    private static void SeedTicketPriorities(ApplicationDbContext context)
    {
        if (context.TicketPriorities.Any()) return;

        var priorities = new List<TicketPriority>
        {
            new() { Name = "Low", Level = 1 },
            new() { Name = "Medium", Level = 2 },
            new() { Name = "High", Level = 3 },
            new() { Name = "Critical", Level = 4 }
        };

        context.TicketPriorities.AddRange(priorities);
    }

    // -------------------------
    // SLA Policies
    // -------------------------
    private static void SeedSLAPolicies(ApplicationDbContext context)
    {
        if (context.SLAPolicies.Any()) return;

        var slas = new List<SLAPolicy>
        {
            new() { Name = "Low SLA", ResolutionHours = 72 },
            new() { Name = "Medium SLA", ResolutionHours = 48 },
            new() { Name = "High SLA", ResolutionHours = 24 },
            new() { Name = "Critical SLA", ResolutionHours = 8 }
        };

        context.SLAPolicies.AddRange(slas);
    }

    // -------------------------
    // Ticket Categories
    // -------------------------
    private static void SeedTicketCategories(ApplicationDbContext context)
    {
        if (context.TicketCategories.Any()) return;

        var categories = new List<TicketCategory>
        {
            new()
            {
                Name = "Software",
                Description = "Application related issues"
            },
            new()
            {
                Name = "Hardware",
                Description = "Hardware or device failures"
            },
            new()
            {
                Name = "Network",
                Description = "Network or connectivity issues"
            },
            new()
            {
                Name = "Access",
                Description = "Login, permissions, or access issues"
            }
        };

        context.TicketCategories.AddRange(categories);
    }
}
