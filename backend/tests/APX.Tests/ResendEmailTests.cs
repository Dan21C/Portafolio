using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using APX.Application.Emailing;
using APX.Infrastructure.Emailing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace APX.Tests;

public sealed class ResendEmailTests
{
    private const string ApiKey = "re_super-secret-test-key";

    [Fact]
    public async Task Success_sends_expected_payload_with_bearer_authorization()
    {
        var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK));
        var transport = CreateTransport(handler, out _);
        var message = new EmailMessage([new("customer@example.com", "Ada")], "Hello", "text body", "<p>html body</p>", new EmailAddress("reply@example.com", "Sales"), "admin-otp/11111111-1111-1111-1111-111111111111");

        await transport.SendAsync(message, default);

        Assert.Single(handler.Captured);
        var captured = handler.Captured[0];
        Assert.Equal("Bearer", captured.Authorization?.Scheme);
        Assert.Equal(ApiKey, captured.Authorization?.Parameter);
        Assert.Equal(HttpMethod.Post, captured.Method);
        Assert.Equal("admin-otp/11111111-1111-1111-1111-111111111111", captured.IdempotencyKey);

        using var json = JsonDocument.Parse(captured.Body);
        var root = json.RootElement;
        Assert.Equal("APX <sender@example.com>", root.GetProperty("from").GetString());
        Assert.Equal("Ada <customer@example.com>", root.GetProperty("to")[0].GetString());
        Assert.Equal("Hello", root.GetProperty("subject").GetString());
        Assert.Equal("<p>html body</p>", root.GetProperty("html").GetString());
        Assert.Equal("text body", root.GetProperty("text").GetString());
        Assert.Equal("Sales <reply@example.com>", root.GetProperty("reply_to").GetString());
    }

    [Fact]
    public async Task Retries_on_429_and_succeeds()
    {
        var handler = new FakeHttpMessageHandler(
            _ => new HttpResponseMessage(HttpStatusCode.TooManyRequests),
            _ => new HttpResponseMessage(HttpStatusCode.OK));
        var transport = CreateTransport(handler, out _);

        await transport.SendAsync(Message("project-internal/id-1"), default);

        Assert.Equal(2, handler.Captured.Count);
        Assert.Equal("project-internal/id-1", handler.Captured[0].IdempotencyKey);
        Assert.Equal(handler.Captured[0].IdempotencyKey, handler.Captured[1].IdempotencyKey);
    }

    [Fact]
    public async Task Retries_on_500_and_succeeds()
    {
        var handler = new FakeHttpMessageHandler(
            _ => new HttpResponseMessage(HttpStatusCode.InternalServerError),
            _ => new HttpResponseMessage(HttpStatusCode.OK));
        var transport = CreateTransport(handler, out _);

        await transport.SendAsync(Message("project-customer/id-2"), default);

        Assert.Equal(2, handler.Captured.Count);
    }

    [Fact]
    public async Task Does_not_retry_on_400()
    {
        var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.BadRequest));
        var transport = CreateTransport(handler, out _);

        var ex = await Assert.ThrowsAsync<EmailTransportException>(() => transport.SendAsync(Message(), default));

        Assert.Equal("resend_validation_failed", ex.Code);
        Assert.Single(handler.Captured);
    }

    [Theory]
    [InlineData(HttpStatusCode.Unauthorized)]
    [InlineData(HttpStatusCode.Forbidden)]
    public async Task Does_not_retry_on_401_or_403(HttpStatusCode status)
    {
        var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(status));
        var transport = CreateTransport(handler, out _);

        var ex = await Assert.ThrowsAsync<EmailTransportException>(() => transport.SendAsync(Message(), default));

        Assert.Equal("resend_auth_failed", ex.Code);
        Assert.Single(handler.Captured);
    }

    [Fact]
    public async Task Does_not_retry_on_422()
    {
        var handler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.UnprocessableEntity));
        var transport = CreateTransport(handler, out _);

        var ex = await Assert.ThrowsAsync<EmailTransportException>(() => transport.SendAsync(Message(), default));

        Assert.Equal("resend_validation_failed", ex.Code);
        Assert.Single(handler.Captured);
    }

    [Fact]
    public async Task Timeout_is_retried_then_fails_with_safe_code()
    {
        var handler = new FakeHttpMessageHandler(
            _ => throw new TaskCanceledException("simulated timeout"),
            _ => throw new TaskCanceledException("simulated timeout"),
            _ => throw new TaskCanceledException("simulated timeout"));
        var transport = CreateTransport(handler, out _, maxAttempts: 3);

        var ex = await Assert.ThrowsAsync<EmailTransportException>(() => transport.SendAsync(Message(), default));

        Assert.Equal("resend_delivery_failed", ex.Code);
        Assert.Equal(3, handler.Captured.Count);
    }

    [Fact]
    public async Task Api_key_never_appears_in_logs_across_success_and_failure()
    {
        var failureHandler = new FakeHttpMessageHandler(
            _ => new HttpResponseMessage(HttpStatusCode.InternalServerError),
            _ => new HttpResponseMessage(HttpStatusCode.InternalServerError));
        var transportFailure = CreateTransport(failureHandler, out var failureLogger, maxAttempts: 2);
        await Assert.ThrowsAsync<EmailTransportException>(() => transportFailure.SendAsync(Message(), default));
        Assert.All(failureLogger.Messages, m => Assert.DoesNotContain(ApiKey, m));

        var successHandler = new FakeHttpMessageHandler(_ => new HttpResponseMessage(HttpStatusCode.OK));
        var transportSuccess = CreateTransport(successHandler, out var successLogger);
        await transportSuccess.SendAsync(Message(), default);
        Assert.All(successLogger.Messages, m => Assert.DoesNotContain(ApiKey, m));
    }

    [Fact]
    public void Resend_provider_is_selected_by_dependency_injection()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        var options = new TransactionalEmailOptions("Resend", "sender@example.com", "APX", null, [], new("", 0, "", ""), null, new("re_test_key", "https://api.resend.com", 5, 3));
        services.AddSingleton(options);
        services.AddEmailTransport("Resend", options);
        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();
        var transport = scope.ServiceProvider.GetRequiredService<IEmailTransport>();
        Assert.IsType<ResendEmailTransport>(transport);
    }

    [Fact]
    public void Smtp_provider_is_selected_by_dependency_injection()
    {
        var services = new ServiceCollection();
        services.AddLogging();
        var options = new TransactionalEmailOptions("Smtp", "sender@example.com", "APX", null, [], new("smtp.example.com", 587, "user", "secret"), null);
        services.AddSingleton(options);
        services.AddEmailTransport("Smtp", options);
        using var provider = services.BuildServiceProvider();
        using var scope = provider.CreateScope();
        var transport = scope.ServiceProvider.GetRequiredService<IEmailTransport>();
        Assert.IsType<SmtpEmailTransport>(transport);
    }

    private static EmailMessage Message(string? idempotencyKey = null) =>
        new([new("customer@example.com", "Ada")], "Hello", "text body", "<p>html body</p>", null, idempotencyKey);

    private static ResendEmailTransport CreateTransport(FakeHttpMessageHandler handler, out CapturingLogger<ResendEmailTransport> logger, int maxAttempts = 3)
    {
        var client = new HttpClient(handler) { BaseAddress = new Uri("https://api.resend.com/") };
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", ApiKey);
        var options = new TransactionalEmailOptions("Resend", "sender@example.com", "APX", null, [], new("", 0, "", ""), null, new(ApiKey, "https://api.resend.com", 5, maxAttempts));
        logger = new CapturingLogger<ResendEmailTransport>();
        return new ResendEmailTransport(client, options, logger);
    }

    private sealed record CapturedRequest(HttpMethod Method, Uri? RequestUri, string? IdempotencyKey, AuthenticationHeaderValue? Authorization, string Body);

    private sealed class FakeHttpMessageHandler(params Func<HttpRequestMessage, HttpResponseMessage>[] initialResponses) : HttpMessageHandler
    {
        private readonly Queue<Func<HttpRequestMessage, HttpResponseMessage>> responses = new(initialResponses);
        public List<CapturedRequest> Captured { get; } = [];

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var body = request.Content is null ? string.Empty : await request.Content.ReadAsStringAsync(cancellationToken);
            request.Headers.TryGetValues("Idempotency-Key", out var idempotencyValues);
            Captured.Add(new(request.Method, request.RequestUri, idempotencyValues?.FirstOrDefault(), request.Headers.Authorization, body));
            if (responses.Count == 0) throw new InvalidOperationException("No more fake responses configured.");
            return responses.Dequeue()(request);
        }
    }

    private sealed class CapturingLogger<T> : ILogger<T>
    {
        public List<string> Messages { get; } = [];
        public IDisposable BeginScope<TState>(TState state) where TState : notnull => NullScope.Instance;
        public bool IsEnabled(LogLevel logLevel) => true;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            Messages.Add(formatter(state, exception));
            if (exception is not null) Messages.Add(exception.ToString());
        }
        private sealed class NullScope : IDisposable { public static readonly NullScope Instance = new(); public void Dispose() { } }
    }

}
