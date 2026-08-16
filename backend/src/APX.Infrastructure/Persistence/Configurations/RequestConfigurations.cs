using APX.Domain.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace APX.Infrastructure.Persistence.Configurations;

public sealed class ProjectRequestConfiguration : IEntityTypeConfiguration<ProjectRequest>
{
    public void Configure(EntityTypeBuilder<ProjectRequest> b)
    {
        b.ToTable("project_requests", table => table.HasCheckConstraint("ck_project_requests_attendees", "attendees IS NULL OR attendees >= 0"));
        b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.Name).HasColumnName("name").HasMaxLength(180).IsRequired(); b.Property(x => x.Company).HasColumnName("company").HasMaxLength(180).IsRequired(); b.Property(x => x.Email).HasColumnName("email").HasMaxLength(320).IsRequired(); b.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(80).IsRequired(); b.Property(x => x.ProjectType).HasColumnName("project_type").HasMaxLength(120).IsRequired(); b.Property(x => x.City).HasColumnName("city").HasMaxLength(160).IsRequired(); b.Property(x => x.ApproximateDate).HasColumnName("approximate_date").HasColumnType("date"); b.Property(x => x.Attendees).HasColumnName("attendees"); b.Property(x => x.Message).HasColumnName("message"); b.Property(x => x.Status).HasColumnName("status").HasMaxLength(30).HasConversion<string>(); b.Property(x => x.Source).HasColumnName("source").HasMaxLength(80).IsRequired(); b.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamptz"); b.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasColumnType("timestamptz"); b.HasIndex(x => x.Status).HasDatabaseName("ix_project_requests_status");
    }
}

public sealed class ProjectRequestItemConfiguration : IEntityTypeConfiguration<ProjectRequestItem>
{
    public void Configure(EntityTypeBuilder<ProjectRequestItem> b)
    {
        b.ToTable("project_request_items", table => table.HasCheckConstraint("ck_project_request_items_quantity", "quantity > 0"));
        b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.ProjectRequestId).HasColumnName("project_request_id"); b.Property(x => x.SolutionId).HasColumnName("solution_id"); b.Property(x => x.Quantity).HasColumnName("quantity"); b.Property(x => x.AddedAt).HasColumnName("added_at").HasColumnType("timestamptz"); b.Property(x => x.SolutionNameSnapshot).HasColumnName("solution_name_snapshot").HasMaxLength(200).IsRequired(); b.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(1000); b.HasOne(x => x.ProjectRequest).WithMany(x => x.Items).HasForeignKey(x => x.ProjectRequestId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.Solution).WithMany().HasForeignKey(x => x.SolutionId).OnDelete(DeleteBehavior.Restrict);
    }
}
