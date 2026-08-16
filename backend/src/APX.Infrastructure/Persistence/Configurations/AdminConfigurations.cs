using APX.Domain.Admin;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace APX.Infrastructure.Persistence.Configurations;

public sealed class AdminUserConfiguration : IEntityTypeConfiguration<AdminUser>
{
    public void Configure(EntityTypeBuilder<AdminUser> b)
    {
        b.ToTable("admin_users", t => t.HasCheckConstraint("ck_admin_users_destination", "email IS NOT NULL OR phone IS NOT NULL")); b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.Email).HasColumnName("email").HasMaxLength(320); b.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(80); b.Property(x => x.DisplayName).HasColumnName("display_name").HasMaxLength(180).IsRequired(); b.Property(x => x.Status).HasColumnName("status").HasMaxLength(30).HasConversion<string>(); b.Property(x => x.LastLoginAt).HasColumnName("last_login_at").HasColumnType("timestamptz"); b.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamptz"); b.Property(x => x.UpdatedAt).HasColumnName("updated_at").HasColumnType("timestamptz"); b.HasIndex(x => x.Email).IsUnique().HasFilter("email IS NOT NULL").HasDatabaseName("ux_admin_users_email"); b.HasIndex(x => x.Phone).IsUnique().HasFilter("phone IS NOT NULL").HasDatabaseName("ux_admin_users_phone");
    }
}
public sealed class RoleConfiguration : IEntityTypeConfiguration<Role> { public void Configure(EntityTypeBuilder<Role> b) { b.ToTable("roles"); b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.Name).HasColumnName("name").HasMaxLength(80).IsRequired(); b.HasIndex(x => x.Name).IsUnique().HasDatabaseName("ux_roles_name"); } }
public sealed class AdminUserRoleConfiguration : IEntityTypeConfiguration<AdminUserRole> { public void Configure(EntityTypeBuilder<AdminUserRole> b) { b.ToTable("admin_user_roles"); b.HasKey(x => new { x.AdminUserId, x.RoleId }); b.Property(x => x.AdminUserId).HasColumnName("admin_user_id"); b.Property(x => x.RoleId).HasColumnName("role_id"); b.HasOne(x => x.AdminUser).WithMany(x => x.UserRoles).HasForeignKey(x => x.AdminUserId).OnDelete(DeleteBehavior.Cascade); b.HasOne(x => x.Role).WithMany(x => x.UserRoles).HasForeignKey(x => x.RoleId).OnDelete(DeleteBehavior.Restrict); } }
public sealed class AuditEntryConfiguration : IEntityTypeConfiguration<AuditEntry>
{
    public void Configure(EntityTypeBuilder<AuditEntry> b)
    {
        b.ToTable("audit_log"); b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.AdminUserId).HasColumnName("admin_user_id"); b.Property(x => x.EntityType).HasColumnName("entity_type").HasMaxLength(160).IsRequired(); b.Property(x => x.EntityId).HasColumnName("entity_id"); b.Property(x => x.Action).HasColumnName("action").HasMaxLength(120).IsRequired(); b.Property(x => x.BeforeJson).HasColumnName("before_json").HasColumnType("jsonb"); b.Property(x => x.AfterJson).HasColumnName("after_json").HasColumnType("jsonb"); b.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamptz"); b.Property(x => x.IpAddress).HasColumnName("ip_address").HasMaxLength(64); b.HasOne(x => x.AdminUser).WithMany(x => x.AuditEntries).HasForeignKey(x => x.AdminUserId).OnDelete(DeleteBehavior.SetNull); b.HasIndex(x => new { x.EntityType, x.EntityId }).HasDatabaseName("ix_audit_log_entity");
    }
}
