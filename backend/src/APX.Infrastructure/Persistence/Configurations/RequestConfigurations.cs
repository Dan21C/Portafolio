using APX.Domain.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace APX.Infrastructure.Persistence.Configurations;
public sealed class ProjectRequestConfiguration : IEntityTypeConfiguration<ProjectRequest>
{
    public void Configure(EntityTypeBuilder<ProjectRequest> b)
    {
        b.ToTable("project_requests", t => t.HasCheckConstraint("ck_project_requests_attendees", "attendees IS NULL OR attendees > 0")); b.HasKey(x => x.Id);
        b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.RequestNumber).HasColumnName("request_number").HasMaxLength(20).IsRequired(); b.Property(x => x.Name).HasColumnName("name").HasMaxLength(150).IsRequired(); b.Property(x => x.Company).HasColumnName("company").HasMaxLength(200); b.Property(x => x.Email).HasColumnName("email").HasMaxLength(320).IsRequired(); b.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(50).IsRequired(); b.Property(x => x.City).HasColumnName("city").HasMaxLength(120).IsRequired(); b.Property(x => x.ApproximateDate).HasColumnName("approximate_date").HasColumnType("date"); b.Property(x => x.Attendees).HasColumnName("attendees"); b.Property(x => x.Message).HasColumnName("message").HasMaxLength(3000); b.Property(x => x.Status).HasColumnName("status").HasMaxLength(30).HasConversion<string>();
        b.Property(x => x.PrivacyAcceptedAt).HasColumnName("privacy_accepted_at").HasColumnType("timestamptz"); b.Property(x => x.PrivacyPolicyVersion).HasColumnName("privacy_policy_version").HasMaxLength(80).IsRequired(); b.Property(x => x.PrivacyPolicyUrl).HasColumnName("privacy_policy_url").HasMaxLength(500); b.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamptz"); b.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasColumnType("timestamptz"); b.Property(x => x.LastContactedAt).HasColumnName("last_contacted_at").HasColumnType("timestamptz"); b.Property(x => x.QualifiedAt).HasColumnName("qualified_at").HasColumnType("timestamptz"); b.Property(x => x.WonAt).HasColumnName("won_at").HasColumnType("timestamptz"); b.Property(x => x.LostAt).HasColumnName("lost_at").HasColumnType("timestamptz"); b.Property(x => x.ArchivedAt).HasColumnName("archived_at").HasColumnType("timestamptz"); b.Property(x => x.Version).HasColumnName("xmin").IsRowVersion();
        b.HasIndex(x => x.RequestNumber).IsUnique().HasDatabaseName("ux_project_requests_request_number"); b.HasIndex(x => new { x.Status, x.CreatedAt }).HasDatabaseName("ix_project_requests_status_created_at"); b.HasIndex(x => x.CreatedAt).HasDatabaseName("ix_project_requests_created_at"); b.HasIndex(x => x.Email).HasDatabaseName("ix_project_requests_email"); b.HasIndex(x => new { x.LastContactedAt, x.CreatedAt }).HasDatabaseName("ix_project_requests_contacted_created_at");
    }
}
public sealed class ProjectRequestItemConfiguration : IEntityTypeConfiguration<ProjectRequestItem>
{
    public void Configure(EntityTypeBuilder<ProjectRequestItem> b)
    {
        b.ToTable("project_request_items"); b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.ProjectRequestId).HasColumnName("project_request_id"); b.Property(x => x.SolutionId).HasColumnName("solution_id"); b.Property(x => x.SolutionName).HasColumnName("solution_name").HasMaxLength(200).IsRequired(); b.Property(x => x.SolutionSlug).HasColumnName("solution_slug").HasMaxLength(180).IsRequired(); b.Property(x => x.CategoryName).HasColumnName("category_name").HasMaxLength(160).IsRequired(); b.Property(x => x.SolutionDescription).HasColumnName("solution_description").HasMaxLength(1000);
        b.HasOne(x => x.ProjectRequest).WithMany(x => x.Items).HasForeignKey(x => x.ProjectRequestId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.Solution).WithMany().HasForeignKey(x => x.SolutionId).OnDelete(DeleteBehavior.Restrict); b.HasIndex(x => x.ProjectRequestId).HasDatabaseName("ix_project_request_items_request_id"); b.HasIndex(x => x.SolutionId).HasDatabaseName("ix_project_request_items_solution_id");
    }
}
public sealed class ProjectRequestStatusHistoryConfiguration : IEntityTypeConfiguration<ProjectRequestStatusHistory>
{
    public void Configure(EntityTypeBuilder<ProjectRequestStatusHistory> b)
    {
        b.ToTable("project_request_status_history"); b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.ProjectRequestId).HasColumnName("project_request_id"); b.Property(x => x.PreviousStatus).HasColumnName("previous_status").HasMaxLength(30).HasConversion<string?>(); b.Property(x => x.NewStatus).HasColumnName("new_status").HasMaxLength(30).HasConversion<string>(); b.Property(x => x.ChangedByAdminUserId).HasColumnName("changed_by_admin_user_id"); b.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamptz"); b.HasOne(x => x.ProjectRequest).WithMany(x => x.StatusHistory).HasForeignKey(x => x.ProjectRequestId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.ChangedByAdminUser).WithMany().HasForeignKey(x => x.ChangedByAdminUserId).OnDelete(DeleteBehavior.SetNull); b.HasIndex(x => new { x.ProjectRequestId, x.CreatedAt }).HasDatabaseName("ix_project_request_history_request_created");
    }
}
