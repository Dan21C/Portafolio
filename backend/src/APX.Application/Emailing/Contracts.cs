namespace APX.Application.Emailing;
public sealed record EmailAddress(string Address, string? Name = null);
public sealed record EmailMessage(IReadOnlyList<EmailAddress> To, string Subject, string TextBody, string HtmlBody, EmailAddress? ReplyTo = null, string? IdempotencyKey = null);
public interface IEmailTransport { Task SendAsync(EmailMessage message, CancellationToken ct); }
public enum EmailDeliveryType { AdminOtp, AdminInvitation, ProjectRequestCustomerConfirmation, ProjectRequestInternalNotification }
public enum EmailDeliveryStatus { Pending, Sent, Failed }
public sealed record EmailDeliveryDraft(EmailDeliveryType Type, string Recipient, string RelatedEntityType, Guid RelatedEntityId);
public interface IEmailDeliveryRepository
{
    Task<Guid> CreateAsync(EmailDeliveryDraft draft, CancellationToken ct);
    Task MarkSentAsync(Guid id, CancellationToken ct);
    Task MarkFailedAsync(Guid id, string errorCode, CancellationToken ct);
}
