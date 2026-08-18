using APX.Domain.Emailing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace APX.Infrastructure.Persistence.Configurations;
public sealed class EmailDeliveryConfiguration : IEntityTypeConfiguration<EmailDelivery>
{
    public void Configure(EntityTypeBuilder<EmailDelivery> b)
    {
        b.ToTable("email_deliveries"); b.HasKey(x => x.Id); b.Property(x => x.Id).HasColumnName("id"); b.Property(x => x.Type).HasColumnName("type").HasMaxLength(60).HasConversion<string>(); b.Property(x => x.Recipient).HasColumnName("recipient").HasMaxLength(320).IsRequired(); b.Property(x => x.RelatedEntityType).HasColumnName("related_entity_type").HasMaxLength(80).IsRequired(); b.Property(x => x.RelatedEntityId).HasColumnName("related_entity_id"); b.Property(x => x.Status).HasColumnName("status").HasMaxLength(20).HasConversion<string>(); b.Property(x => x.Attempts).HasColumnName("attempts"); b.Property(x => x.LastAttemptAt).HasColumnName("last_attempt_at").HasColumnType("timestamptz"); b.Property(x => x.SentAt).HasColumnName("sent_at").HasColumnType("timestamptz"); b.Property(x => x.LastErrorCode).HasColumnName("last_error_code").HasMaxLength(120); b.Property(x => x.CreatedAt).HasColumnName("created_at").HasColumnType("timestamptz"); b.HasIndex(x => x.Status).HasDatabaseName("ix_email_deliveries_status"); b.HasIndex(x => x.CreatedAt).HasDatabaseName("ix_email_deliveries_created_at"); b.HasIndex(x => x.RelatedEntityId).HasDatabaseName("ix_email_deliveries_related_entity_id"); b.HasIndex(x => x.Type).HasDatabaseName("ix_email_deliveries_type");
    }
}
