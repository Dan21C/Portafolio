using APX.Domain.Admin;
using APX.Domain.Catalog;
using APX.Domain.Requests;
using Microsoft.EntityFrameworkCore;

namespace APX.Infrastructure.Persistence;

public sealed class ApxDbContext(DbContextOptions<ApxDbContext> options) : DbContext(options)
{
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<Solution> Solutions => Set<Solution>();
    public DbSet<SolutionMedia> SolutionMedia => Set<SolutionMedia>();
    public DbSet<SolutionFeature> SolutionFeatures => Set<SolutionFeature>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<UseCase> UseCases => Set<UseCase>();
    public DbSet<Modality> Modalities => Set<Modality>();
    public DbSet<ProjectRequest> ProjectRequests => Set<ProjectRequest>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<AuditEntry> AuditLog => Set<AuditEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApxDbContext).Assembly);
        modelBuilder.Entity<Solution>().HasQueryFilter(solution => solution.DeletedAt == null);
    }
}
