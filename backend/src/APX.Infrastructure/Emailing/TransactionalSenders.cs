using System.Text.Encodings.Web;
using APX.Application.Authentication;
using APX.Application.Emailing;
using APX.Application.Requests;
using Microsoft.Extensions.Logging;
namespace APX.Infrastructure.Emailing;
public sealed class TransportOtpEmailSender(IEmailTransport transport, IEmailDeliveryRepository deliveries, ILogger<TransportOtpEmailSender> logger) : IEmailSender
{
    public async Task SendOtpAsync(Guid challengeId, string email, string code, DateTimeOffset expiresAt, CancellationToken ct)
    {
        var deliveryId = await deliveries.CreateAsync(new(EmailDeliveryType.AdminOtp, email, "OtpChallenge", challengeId), ct); var minutes = Math.Max(1, (int)Math.Ceiling((expiresAt - DateTimeOffset.UtcNow).TotalMinutes)); var encodedCode = HtmlEncoder.Default.Encode(code);
        var message = new EmailMessage([new(email)], "Tu código de acceso a APX", $"APX\n\nCódigo de acceso: {code}\n\nVálido durante {minutes} minutos.\n\nSi no solicitaste este código, ignora este mensaje.", $"<div style=\"font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#171717\"><p style=\"font-weight:800;letter-spacing:.18em\">APX</p><h1 style=\"font-size:24px\">Tu código de acceso</h1><p>Usa este código para ingresar al administrador:</p><div style=\"font-size:34px;font-weight:800;letter-spacing:.22em;padding:20px;background:#f3f3f3;text-align:center\">{encodedCode}</div><p>Válido durante {minutes} minutos.</p><p style=\"color:#666\">Si no solicitaste este código, ignora este mensaje.</p></div>", IdempotencyKey: $"admin-otp/{deliveryId}");
        try { await transport.SendAsync(message, ct); await deliveries.MarkSentAsync(deliveryId, ct); }
        catch (Exception ex) { await deliveries.MarkFailedAsync(deliveryId, SafeCode(ex), ct); logger.LogError("OTP email delivery failed with code {ErrorCode}.", SafeCode(ex)); throw new EmailDeliveryException("email_delivery_failed"); }
    }
    private static string SafeCode(Exception ex) => ex is EmailTransportException transportError ? transportError.Code : ex.GetType().Name;
}
public sealed class ProjectRequestEmailNotifier(IEmailTransport transport, IEmailDeliveryRepository deliveries, TransactionalEmailOptions options, ILogger<ProjectRequestEmailNotifier> logger) : IProjectRequestNotifier
{
    public async Task NotifyCreatedAsync(ProjectRequestNotificationDto request, CancellationToken ct)
    {
        await Deliver(EmailDeliveryType.ProjectRequestCustomerConfirmation, request.Email, Customer(request), request.Id, ct);
        foreach (var recipient in options.InternalRecipients.Distinct(StringComparer.OrdinalIgnoreCase)) await Deliver(EmailDeliveryType.ProjectRequestInternalNotification, recipient, Internal(request, recipient), request.Id, ct);
    }
    private async Task Deliver(EmailDeliveryType type, string recipient, EmailMessage message, Guid requestId, CancellationToken ct)
    {
        var id = await deliveries.CreateAsync(new(type, recipient, "ProjectRequest", requestId), ct);
        var prefix = type == EmailDeliveryType.ProjectRequestCustomerConfirmation ? "project-customer" : "project-internal";
        var outgoing = message with { IdempotencyKey = $"{prefix}/{id}" };
        try { await transport.SendAsync(outgoing, ct); await deliveries.MarkSentAsync(id, ct); }
        catch (Exception ex) { var code = ex is EmailTransportException transportError ? transportError.Code : ex.GetType().Name; await deliveries.MarkFailedAsync(id, code, ct); logger.LogError("Project request email {DeliveryType} failed for {ProjectRequestId} with code {ErrorCode}.", type, requestId, code); }
    }
    private EmailMessage Customer(ProjectRequestNotificationDto r) { var solutions = TextList(r.SolutionNames); var htmlSolutions = HtmlList(r.SolutionNames); var company = string.IsNullOrWhiteSpace(r.Company) ? string.Empty : $"\nEmpresa: {r.Company}"; var htmlCompany = string.IsNullOrWhiteSpace(r.Company) ? string.Empty : $"<p><b>Empresa:</b> {E(r.Company)}</p>"; return new([new(r.Email, r.Name)], $"Recibimos tu solicitud {Header(r.RequestNumber)}", $"Hola {r.Name},\n\nRecibimos tu solicitud {r.RequestNumber}. Nuestro equipo revisará la información y se pondrá en contacto contigo.\n\nFecha: {r.CreatedAt:yyyy-MM-dd}\nCiudad: {r.City}{company}\nSoluciones:\n{solutions}", $"<div style=\"font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#171717\"><p style=\"font-weight:800;letter-spacing:.18em\">APX</p><h1>Recibimos tu solicitud</h1><p>Hola {E(r.Name)},</p><p>Recibimos tu solicitud <b>{E(r.RequestNumber)}</b>. Nuestro equipo revisará la información y se pondrá en contacto contigo.</p><p><b>Fecha:</b> {r.CreatedAt:yyyy-MM-dd}</p><p><b>Ciudad:</b> {E(r.City)}</p>{htmlCompany}<h2>Soluciones</h2>{htmlSolutions}</div>", ReplyTo()); }
    private EmailMessage Internal(ProjectRequestNotificationDto r, string recipient) { var admin = string.IsNullOrWhiteSpace(options.AdminBaseUrl) ? string.Empty : $"\nAdmin: {options.AdminBaseUrl.TrimEnd('/')}/solicitudes/{r.Id}"; var adminHtml = string.IsNullOrWhiteSpace(options.AdminBaseUrl) ? string.Empty : $"<p><a href=\"{E(options.AdminBaseUrl.TrimEnd('/'))}/solicitudes/{r.Id}\">Abrir en Admin</a></p>"; return new([new(recipient)], $"Nueva solicitud {Header(r.RequestNumber)}", $"Nueva solicitud {r.RequestNumber}\n\nNombre: {r.Name}\nEmpresa: {r.Company ?? "No indicada"}\nEmail: {r.Email}\nTeléfono: {r.Phone}\nCiudad: {r.City}\nFecha aproximada: {r.ApproximateDate?.ToString() ?? "No indicada"}\nAsistentes: {r.Attendees?.ToString() ?? "No indicados"}\nMensaje:\n{r.Message ?? "No indicado"}\n\nSoluciones:\n{TextList(r.SolutionNames)}{admin}", $"<div style=\"font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#171717\"><p style=\"font-weight:800;letter-spacing:.18em\">APX</p><h1>Nueva solicitud {E(r.RequestNumber)}</h1><p><b>Nombre:</b> {E(r.Name)}</p><p><b>Empresa:</b> {E(r.Company ?? "No indicada")}</p><p><b>Email:</b> {E(r.Email)}</p><p><b>Teléfono:</b> {E(r.Phone)}</p><p><b>Ciudad:</b> {E(r.City)}</p><p><b>Fecha aproximada:</b> {E(r.ApproximateDate?.ToString() ?? "No indicada")}</p><p><b>Asistentes:</b> {E(r.Attendees?.ToString() ?? "No indicados")}</p><h2>Mensaje</h2><p>{E(r.Message ?? "No indicado").Replace("\n", "<br>")}</p><h2>Soluciones</h2>{HtmlList(r.SolutionNames)}{adminHtml}</div>", new(r.Email, r.Name)); }
    private EmailAddress? ReplyTo() => string.IsNullOrWhiteSpace(options.ReplyToAddress) ? null : new(options.ReplyToAddress, options.FromName);
    private static string E(string value) => HtmlEncoder.Default.Encode(value); private static string Header(string value) => value.Replace("\r", string.Empty).Replace("\n", string.Empty); private static string TextList(IEnumerable<string> values) => string.Join("\n", values.Select(x => $"- {x}")); private static string HtmlList(IEnumerable<string> values) => $"<ul>{string.Join(string.Empty, values.Select(x => $"<li>{E(x)}</li>"))}</ul>";
}
public sealed class EmailDeliveryException(string code) : Exception("Email delivery failed.") { public string Code { get; } = code; }
