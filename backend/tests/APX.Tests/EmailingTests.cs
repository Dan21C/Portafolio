using APX.Application.Emailing;
using APX.Application.Requests;
using APX.Infrastructure.Emailing;
using APX.Application.AdminUsers;
using Microsoft.Extensions.Logging.Abstractions;
namespace APX.Tests;
public sealed class EmailingTests
{
    [Fact] public async Task Otp_uses_transport_and_safe_template() { var transport = new FakeTransport(); var deliveries = new FakeDeliveries(); var sender = new TransportOtpEmailSender(transport, deliveries, NullLogger<TransportOtpEmailSender>.Instance); var challenge = Guid.NewGuid(); await sender.SendOtpAsync(challenge, "admin@example.com", "123456", DateTimeOffset.UtcNow.AddMinutes(5), default); Assert.Contains("123456", transport.Messages.Single().TextBody); Assert.Contains("APX", transport.Messages.Single().HtmlBody); Assert.Equal(challenge, deliveries.Drafts.Single().RelatedEntityId); Assert.Single(deliveries.Sent); }
    [Fact] public async Task Otp_failure_marks_delivery_failed() { var transport = new FakeTransport { Failure = new EmailTransportException("smtp_delivery_failed") }; var deliveries = new FakeDeliveries(); var sender = new TransportOtpEmailSender(transport, deliveries, NullLogger<TransportOtpEmailSender>.Instance); await Assert.ThrowsAsync<EmailDeliveryException>(() => sender.SendOtpAsync(Guid.NewGuid(), "admin@example.com", "123456", DateTimeOffset.UtcNow.AddMinutes(5), default)); Assert.Single(deliveries.Failed); Assert.Empty(deliveries.Sent); }
    [Fact] public async Task Project_request_sends_customer_and_each_internal_recipient_with_reply_to_and_html_encoding() { var transport = new FakeTransport(); var deliveries = new FakeDeliveries(); var options = Options(["lead1@example.com", "lead2@example.com"]); var notifier = new ProjectRequestEmailNotifier(transport, deliveries, options, NullLogger<ProjectRequestEmailNotifier>.Instance); await notifier.NotifyCreatedAsync(Request() with { Name = "<script>alert(1)</script>", Message = "Hello\n<b>unsafe</b>" }, default); Assert.Equal(3, transport.Messages.Count); var customer = transport.Messages[0]; Assert.Equal("sales@example.com", customer.ReplyTo?.Address); var internalMessage = transport.Messages[1]; Assert.Equal("client@example.com", internalMessage.ReplyTo?.Address); Assert.DoesNotContain("<script>", customer.HtmlBody); Assert.Contains("&lt;script&gt;", customer.HtmlBody); Assert.DoesNotContain("<b>unsafe</b>", internalMessage.HtmlBody); Assert.Equal(3, deliveries.Sent.Count); }
    [Fact] public async Task Project_request_failure_is_tracked_and_does_not_throw() { var transport = new FakeTransport { Failure = new TimeoutException() }; var deliveries = new FakeDeliveries(); var notifier = new ProjectRequestEmailNotifier(transport, deliveries, Options(["lead@example.com"]), NullLogger<ProjectRequestEmailNotifier>.Instance); await notifier.NotifyCreatedAsync(Request(), default); Assert.Equal(2, deliveries.Failed.Count); }
    [Fact] public async Task Admin_invitation_contains_login_role_and_no_password_or_otp() { var transport = new FakeTransport(); var deliveries = new FakeDeliveries(); var sender = new AdminInvitationSender(transport, deliveries, Options([]), NullLogger<AdminInvitationSender>.Instance); var sent = await sender.SendAsync(new(Guid.NewGuid(),"Ada <Admin>","ada@example.com","Active",["Editor"],DateTimeOffset.UtcNow,DateTimeOffset.UtcNow,null,0,"1"),default); Assert.True(sent); var message=Assert.Single(transport.Messages); Assert.Contains("https://admin.example.com/admin/login",message.TextBody); Assert.Contains("Editor",message.TextBody); Assert.DoesNotContain("123456",message.TextBody); Assert.Contains("Ada &lt;Admin&gt;",message.HtmlBody); Assert.Equal(EmailDeliveryType.AdminInvitation,deliveries.Drafts.Single().Type); }
    private static TransactionalEmailOptions Options(string[] recipients) => new("Smtp", "sender@example.com", "APX", "sales@example.com", recipients, new("smtp.example.com", 587, "user", "secret"), "https://admin.example.com/admin");
    private static ProjectRequestNotificationDto Request() => new(Guid.NewGuid(), "APX-000123", "Ada", "APX", "client@example.com", "+57 300", "Bogotá", null, 100, "Hello", DateTimeOffset.UtcNow, ["Solution A", "Solution B"]);
    private sealed class FakeTransport : IEmailTransport { public List<EmailMessage> Messages { get; } = []; public Exception? Failure { get; init; } public Task SendAsync(EmailMessage message, CancellationToken ct) { Messages.Add(message); if (Failure is not null) throw Failure; return Task.CompletedTask; } }
    private sealed class FakeDeliveries : IEmailDeliveryRepository { public List<EmailDeliveryDraft> Drafts { get; } = []; public List<Guid> Sent { get; } = []; public List<Guid> Failed { get; } = []; public Task<Guid> CreateAsync(EmailDeliveryDraft draft, CancellationToken ct) { Drafts.Add(draft); return Task.FromResult(Guid.NewGuid()); } public Task MarkSentAsync(Guid id, CancellationToken ct) { Sent.Add(id); return Task.CompletedTask; } public Task MarkFailedAsync(Guid id, string code, CancellationToken ct) { Failed.Add(id); return Task.CompletedTask; } }
}

public sealed class SmtpIntegrationFactAttribute : FactAttribute
{
    public SmtpIntegrationFactAttribute() { if (!string.Equals(Environment.GetEnvironmentVariable("APX_RUN_SMTP_INTEGRATION_TESTS"), "true", StringComparison.OrdinalIgnoreCase) || string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("APX_SMTP_TEST_RECIPIENT"))) Skip = "Enable explicitly and configure APX_SMTP_TEST_RECIPIENT."; }
}
public sealed class SmtpIntegrationTests
{
    [SmtpIntegrationFact]
    [Trait("Category", "SmtpIntegration")]
    public async Task Explicit_recipient_receives_transactional_test()
    {
        static string Required(string name) => Environment.GetEnvironmentVariable(name) is { Length: > 0 } value ? value : throw new InvalidOperationException($"Missing {name}.");
        var options = new TransactionalEmailOptions("Smtp", Required("Email__FromAddress"), Environment.GetEnvironmentVariable("Email__FromName") ?? "APX", null, [], new(Required("Email__Smtp__Host"), int.Parse(Required("Email__Smtp__Port")), Required("Email__Smtp__Username"), Required("Email__Smtp__Password"), bool.Parse(Required("Email__Smtp__UseStartTls"))), null);
        var transport = new SmtpEmailTransport(options, NullLogger<SmtpEmailTransport>.Instance); var recipient = Required("APX_SMTP_TEST_RECIPIENT"); await transport.SendAsync(new([new(recipient)], "APX SMTP integration test", "SMTP integration is operational.", "<p><b>APX</b> SMTP integration is operational.</p>"), default);
    }
}
