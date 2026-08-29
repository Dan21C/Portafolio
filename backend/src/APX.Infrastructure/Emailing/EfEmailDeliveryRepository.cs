using APX.Application.Emailing;
using APX.Domain.Admin;
using APX.Domain.Emailing;
using APX.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using DomainDeliveryStatus = APX.Domain.Emailing.EmailDeliveryStatus;
using DomainDeliveryType = APX.Domain.Emailing.EmailDeliveryType;
namespace APX.Infrastructure.Emailing;
public sealed class EfEmailDeliveryRepository(ApxDbContext db) : IEmailDeliveryRepository
{
    public async Task<Guid> CreateAsync(EmailDeliveryDraft draft, CancellationToken ct) { var entity = new EmailDelivery { Id = Guid.NewGuid(), Type = Enum.Parse<DomainDeliveryType>(draft.Type.ToString()), Recipient = draft.Recipient, RelatedEntityType = draft.RelatedEntityType, RelatedEntityId = draft.RelatedEntityId, Status = DomainDeliveryStatus.Pending, CreatedAt = DateTimeOffset.UtcNow }; db.EmailDeliveries.Add(entity); await db.SaveChangesAsync(ct); return entity.Id; }
    public Task MarkSentAsync(Guid id, CancellationToken ct) => Mark(id, true, null, ct);
    public Task MarkFailedAsync(Guid id, string errorCode, CancellationToken ct) => Mark(id, false, errorCode, ct);
    private async Task Mark(Guid id, bool sent, string? error, CancellationToken ct) { var item = await db.EmailDeliveries.SingleAsync(x => x.Id == id, ct); var now = DateTimeOffset.UtcNow; item.Attempts++; item.LastAttemptAt = now; item.Status = sent ? DomainDeliveryStatus.Sent : DomainDeliveryStatus.Failed; item.SentAt = sent ? now : null; item.LastErrorCode = error; var action = item.Type switch { DomainDeliveryType.AdminOtp => sent ? "OtpEmailSent" : "OtpEmailFailed", DomainDeliveryType.AdminInvitation => sent ? "AdminInvitationSent" : "AdminInvitationFailed", DomainDeliveryType.ProjectRequestCustomerConfirmation => sent ? "ProjectRequestCustomerEmailSent" : "ProjectRequestCustomerEmailFailed", _ => sent ? "ProjectRequestInternalEmailSent" : "ProjectRequestInternalEmailFailed" }; db.AuditLog.Add(new AuditEntry { Id = Guid.NewGuid(), EntityType = item.RelatedEntityType, EntityId = item.RelatedEntityId, Action = action, CreatedAt = now }); await db.SaveChangesAsync(ct); }
}
