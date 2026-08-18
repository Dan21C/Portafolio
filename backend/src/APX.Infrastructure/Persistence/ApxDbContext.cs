using APX.Domain.Admin;
using APX.Domain.Catalog;
using APX.Domain.Requests;
using APX.Domain.Emailing;
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
    public DbSet<ProjectRequestItem> ProjectRequestItems => Set<ProjectRequestItem>();
    public DbSet<ProjectRequestStatusHistory> ProjectRequestStatusHistory => Set<ProjectRequestStatusHistory>();
    public DbSet<EmailDelivery> EmailDeliveries => Set<EmailDelivery>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<AuditEntry> AuditLog => Set<AuditEntry>();
    public DbSet<OtpChallenge> OtpChallenges => Set<OtpChallenge>();
    public DbSet<AdminSession> AdminSessions => Set<AdminSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApxDbContext).Assembly);
        modelBuilder.HasSequence<long>("project_request_number_seq").StartsAt(1).IncrementsBy(1);
        modelBuilder.Entity<Solution>().HasQueryFilter(solution => solution.DeletedAt == null);
    }
}
