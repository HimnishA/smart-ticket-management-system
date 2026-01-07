using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();

    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<TicketCategory> TicketCategories => Set<TicketCategory>();
    public DbSet<TicketPriority> TicketPriorities => Set<TicketPriority>();
    public DbSet<SLAPolicy> SLAPolicies => Set<SLAPolicy>();

    public DbSet<TicketAssignment> TicketAssignments => Set<TicketAssignment>();
    public DbSet<TicketComment> TicketComments => Set<TicketComment>();
    public DbSet<TicketActivity> TicketActivities => Set<TicketActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // -------------------------
        // UserRole (Composite Key)
        // -------------------------
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        // -------------------------
        // Ticket ↔ User (Created By)
        // -------------------------
        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.CreatedByUser)
            .WithMany(u => u.CreatedTickets)
            .HasForeignKey(t => t.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // -------------------------
        // Ticket ↔ User (Assigned To)
        // -------------------------
        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedToUser)
            .WithMany(u => u.AssignedTickets)
            .HasForeignKey(t => t.AssignedToUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // -------------------------
        // TicketAssignment ↔ User (Assigned To)
        // -------------------------
        modelBuilder.Entity<TicketAssignment>()
            .HasOne(ta => ta.AssignedToUser)
            .WithMany()
            .HasForeignKey(ta => ta.AssignedToUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // -------------------------
        // TicketAssignment ↔ User (Assigned By)
        // -------------------------
        modelBuilder.Entity<TicketAssignment>()
            .HasOne(ta => ta.AssignedByUser)
            .WithMany()
            .HasForeignKey(ta => ta.AssignedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // -------------------------
        // TicketActivity ↔ User (Performed By)
        // -------------------------
        modelBuilder.Entity<TicketActivity>()
            .HasOne(ta => ta.PerformedByUser)
            .WithMany()
            .HasForeignKey(ta => ta.PerformedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // -------------------------
        // TicketComment ↔ User (Created By)
        // -------------------------
        modelBuilder.Entity<TicketComment>(entity =>
        {
            entity.HasKey(tc => tc.Id);

            entity.Property(tc => tc.Comment)
                .IsRequired()
                .HasMaxLength(2000);

            entity.Property(tc => tc.CreatedAt)
                .IsRequired();

            entity.HasOne(tc => tc.Ticket)
                .WithMany(t => t.Comments)
                .HasForeignKey(tc => tc.TicketId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(tc => tc.CreatedByUser)
                .WithMany()
                .HasForeignKey(tc => tc.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // -------------------------
        // Enum Mapping
        // -------------------------
        modelBuilder.Entity<Ticket>()
            .Property(t => t.Status)
            .HasConversion<int>();

        base.OnModelCreating(modelBuilder);
    }
}
