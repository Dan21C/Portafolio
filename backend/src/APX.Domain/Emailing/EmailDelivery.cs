namespace APX.Domain.Emailing;
public enum EmailDeliveryType { AdminOtp, AdminInvitation, ProjectRequestCustomerConfirmation, ProjectRequestInternalNotification }
public enum EmailDeliveryStatus { Pending, Sent, Failed }
public sealed class EmailDelivery
{
    public Guid Id { get; set; } public EmailDeliveryType Type { get; set; } public string Recipient { get; set; } = string.Empty; public string RelatedEntityType { get; set; } = string.Empty; public Guid RelatedEntityId { get; set; } public EmailDeliveryStatus Status { get; set; } = EmailDeliveryStatus.Pending; public int Attempts { get; set; } public DateTimeOffset? LastAttemptAt { get; set; } public DateTimeOffset? SentAt { get; set; } public string? LastErrorCode { get; set; } public DateTimeOffset CreatedAt { get; set; }
}
