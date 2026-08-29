# APX production readiness

## Architecture and startup

Production consists of the public SPA, Admin SPA, ASP.NET API, Supabase PostgreSQL through the Session Pooler, and Supabase Storage. Transactional email is server-side, via either SMTP (MailKit) or Resend (HTTPS API) depending on `Email__Provider`. The API must run behind HTTPS/reverse proxy and accepts `PORT` or `ASPNETCORE_URLS`; the container defaults to port 8080 as non-root.

Production startup validates configuration and refuses Development email, OTP disclosure, localhost/non-HTTPS URLs, empty CORS, automatic database initialization, or missing secrets. OpenAPI remains Development-only. `.env` and `launchSettings.json` are local tooling only.

## Required backend environment

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__ApxDatabase=<secret Session Pooler connection>
Auth__OtpPepper=<random secret, at least 32 characters>
Auth__EnableDevelopmentOtpDisclosure=false
Auth__CookieSameSite=Lax
Email__Provider=Smtp
Email__FromAddress=<sender>
Email__FromName=APX
Email__ReplyToAddress=<commercial address>
Email__InternalRecipients__0=<recipient>
Email__Smtp__Host=<host>
Email__Smtp__Port=587
Email__Smtp__Username=<secret>
Email__Smtp__Password=<secret>
Email__Smtp__UseStartTls=true
Supabase__Url=https://<project>.supabase.co
Supabase__StorageBucket=apx-catalog
Supabase__SecretKey=<server-only secret>
Cors__AllowedOrigins__0=https://<public-domain>
Cors__AllowedOrigins__1=https://<admin-domain>
AppUrls__PublicBaseUrl=https://<public-domain>
AppUrls__AdminBaseUrl=https://<admin-domain>/admin
Dashboard__LeadAttentionHours=24
Proxy__KnownProxies__0=<trusted proxy IP when required>
```

Alternative: use Resend (HTTPS API) instead of SMTP by setting `Email__Provider=Resend` and replacing the `Email__Smtp__*` block above with:

```text
Email__Provider=Resend
Email__Resend__ApiKey=replace-with-server-only-secret
Email__Resend__BaseUrl=https://api.resend.com
Email__Resend__TimeoutSeconds=15
Email__Resend__MaxAttempts=3
```

`Email__FromAddress`, `Email__FromName`, `Email__ReplyToAddress` and `Email__InternalRecipients__*` are shared by both providers. Production validation requires `Email__Resend__ApiKey` and an HTTPS, non-localhost `Email__Resend__BaseUrl` when `Email__Provider=Resend`, and does not require any `Email__Smtp__*` value in that case.

OTP/session/rate-limit values have safe application defaults but should be reviewed. Never use `VITE_*` for backend secrets. Cookie domain remains unset. With `www`, `admin`, and `api` under one registrable HTTPS domain, `SameSite=Lax` works because they are same-site despite being cross-origin. A genuinely cross-site Admin requires `SameSite=None`; Production cookies remain `Secure`, and CORS/CSRF origins must still be explicit.

## Frontend builds

Both builds require `VITE_USE_API=true` and an absolute non-local HTTPS `VITE_API_URL` in Production. Missing configuration fails the build, preventing mock deployment. Development may continue using mocks.

## Proxy, health and logging

Only `X-Forwarded-For` and `X-Forwarded-Proto` are processed, one hop, from ASP.NET trusted defaults or `Proxy__KnownProxies`. Configure the hosting proxy IP; never accept arbitrary forwarded headers. This preserves client IP for rate limits/audit. Production enables HSTS, HTTPS redirection and API security headers.

- `/health/live`: process only, no dependencies.
- `/health/ready`: PostgreSQL connectivity with five-second timeout.
- `/health`: compatibility endpoint.

Storage is intentionally outside readiness to avoid platform coupling; email delivery (SMTP or Resend) never sends health email. Request logs contain method, path, status, duration, trace ID and authenticated Admin ID, never bodies, cookies, OTPs, credentials, API keys or tokens.

## Migrations, seed and administration

Do not migrate or seed automatically during Production startup. Run explicitly from repository root before releasing the new API:

```powershell
dotnet ef database update --project backend/src/APX.Infrastructure --startup-project backend/src/APX.Api
```

Confirm Supabase backup/PITR policy first. Roll migrations forward where possible; do not automatically downgrade a production database. `bootstrap-admin --email <email> --name <name>` is manual initial/emergency access only. Normal users are managed in Admin.

Run retention manually from a trusted job/shell: `dotnet APX.Api.dll cleanup-auth`. Defaults remove consumed/expired OTP challenges after 7 days and old expired/revoked sessions after 30 days. EmailDelivery retention is 180 days and AuditLog 730 days as documented policy; no automatic deletion is currently performed. ProjectRequests are never automatically deleted.

## Deployment checklist

- [ ] Public, Admin and API domains selected; HTTPS active.
- [ ] Backend environment/secrets loaded in provider secret store.
- [ ] Public/Admin builds use the final API URL and real API mode.
- [ ] Email provider verified: SMTP sender/App Password, or Resend API key and sender domain.
- [ ] Supabase DB pooler, Storage URL/bucket/secret verified.
- [ ] Explicit CORS origins and trusted proxy IP configured.
- [ ] Database backup confirmed and migrations applied explicitly.
- [ ] Existing Admin or controlled bootstrap confirmed.
- [ ] `/health/live` and `/health/ready` healthy.
- [ ] OTP, Admin, catalog, upload, request and dashboard smoke passed.

Rollback frontend by restoring the prior static build and backend by restoring the prior image/release. Do not downgrade the database automatically; assess migration compatibility and use backup/PITR only with an explicit recovery plan.
