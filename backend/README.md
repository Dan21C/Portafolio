# APX Backend

Backend APX construido como monolito modular con ASP.NET Core 10, Entity Framework Core, PostgreSQL y Supabase Storage. La API administrativa usa OTP por email y sesiones opacas HttpOnly; React Admin conserva sus repositorios mock hasta la Fase 2F.

## Estructura

- `src/APX.Domain`: entidades, reglas y enums del dominio.
- `src/APX.Application`: limite para casos de uso de fases posteriores.
- `src/APX.Infrastructure`: `DbContext`, configuraciones EF, migraciones y seed.
- `src/APX.Api`: host HTTP, CORS y `GET /health`.
- `tests/APX.Tests`: pruebas de dominio y consistencia del seed.

La base de datos sera la fuente de verdad cuando se conecten los adaptadores API en una fase posterior. React no debe conectarse directamente a PostgreSQL.

## Configuracion local

No se almacenan credenciales en el repositorio. Configure la conexion mediante variables de entorno:

```powershell
$env:ConnectionStrings__ApxDatabase="Host=<host>;Port=5432;Database=<database>;Username=<user>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true"
$env:Database__InitializeOnStartup="true"
```

En Supabase, obtenga host, puerto, base de datos, usuario y contrasena desde la configuracion del proyecto. `Database__InitializeOnStartup` es opcional y viene desactivado; al activarlo, la API aplica migraciones pendientes y ejecuta el seed idempotente.

## Comandos

Ejecutar desde `backend/`:

```powershell
dotnet restore APX.sln
dotnet build APX.sln
dotnet test APX.sln
dotnet run --project src/APX.Api
```

La API puede arrancar sin una conexion configurada y responde en `GET /health`. Para administrar migraciones:

```powershell
dotnet ef migrations add <Nombre> --project src/APX.Infrastructure --startup-project src/APX.Infrastructure --output-dir Persistence/Migrations
dotnet ef database update --project src/APX.Infrastructure --startup-project src/APX.Infrastructure
```

## Politicas de datos

- Los slugs son unicos y se almacenan en minusculas. La futura capa Application/API debera normalizarlos antes de persistirlos.
- `Solution` y `ServiceCategory` usan el `xmin` nativo de PostgreSQL para concurrencia optimista.
- Las soluciones tienen borrado logico mediante `deleted_at`; las consultas EF ordinarias excluyen registros eliminados.
- Solo puede existir un medio marcado como cover por solucion.
- El seed usa UUID deterministas y conserva las 6 categorias y 36 soluciones congeladas en `catalog-core`.
- Los roles iniciales son `Admin`, `Editor` y `Viewer`. No se crean usuarios ni credenciales.

## API de catalogo

Los endpoints publicos viven bajo `/api/v1/catalog`: categorias, listado y detalle de soluciones, y featured. El listado pagina con `page=1`, `pageSize=12` y maximo 100. Soporta `category`, `search`, `featured`, `tags`, `useCase`, `modality` y `sort` (`order`, `featured`, `name`, `newest`). Varios tags separados por coma usan semantica **ANY**. Featured devuelve como maximo 8 elementos.

La API publica solo devuelve soluciones publicadas, no eliminadas y pertenecientes a categorias activas. Los errores usan `application/problem+json` con `code`, `traceId` y `errors` cuando corresponde.

OpenAPI se publica en Development en `/openapi/v1.json`.

## Autenticacion administrativa

`/api/v1/admin/**` siempre exige una sesion real. El bypass temporal fue retirado. Configure `Auth__OtpPepper` con un secreto aleatorio de al menos 32 caracteres. Los OTP duran 5 minutos, admiten 5 intentos, tienen cooldown de 60 segundos y se almacenan como HMAC-SHA256 con el ID del challenge y el pepper. Las sesiones usan tokens aleatorios de 32 bytes; PostgreSQL guarda solamente SHA-256 del token.

En Development, el emisor no entrega correo real. Para una prueba interactiva puede habilitar explicitamente `Auth__EnableDevelopmentOtpDisclosure=true`; solo entonces el OTP aparece en consola y nunca en Production. El proveedor comercial queda pendiente.

Bootstrap explicito e idempotente del primer administrador:

```powershell
dotnet run --project src/APX.Api -- bootstrap-admin --email admin@empresa.com --name "Administrador APX"
```

La cookie `apx_admin_session` es HttpOnly, SameSite=Lax, Secure fuera de Development y expira a las 8 horas. CORS usa origenes configurados y credenciales. Las mutaciones autenticadas exigen `Origin` o `Referer` perteneciente a `Cors:AllowedOrigins` como defensa CSRF. El rate limiter HTTP es local por instancia; cooldown, intentos y sesiones se controlan en PostgreSQL.

Policies: `AdminRead`, `ContentWrite`, `ContentPublish`, `ContentDelete`, `CategoryManage` y `MediaWrite`. Admin tiene todos los permisos; Editor escribe/publica/gestiona media; Viewer solo lee. DELETE destructivo queda reservado a Admin.

Sus endpoints bajo `/api/v1/admin` permiten CRUD de soluciones y categorias, reorder, duplicar, publicar y despublicar. Al despublicar se cambia a `draft` y `publishedAt` vuelve a `null`, manteniendo la semantica actual del dominio.

Los detalles admin devuelven `rowVersion` como string decimal basado en PostgreSQL `xmin`. El cliente debe devolver exactamente ese valor en cada `PUT`; una version obsoleta produce `409 concurrency_conflict`. El borrado de soluciones es logico. El borrado de categorias con soluciones devuelve `409 category_has_solutions`.

Cada mutacion admin registra una entrada de auditoria sin `AdminUserId` hasta que exista autenticacion real. La suite predeterminada es unitaria/de aplicacion; las pruebas PostgreSQL se habilitan de forma opt-in con una conexion autorizada.

Las pruebas PostgreSQL de `PostgresIntegrationTests` son opt-in y se omiten si no existe `APX_TEST_CONNECTION_STRING`. Debe apuntar exclusivamente a una base aislada o expresamente autorizada. Cada ejecución utiliza slugs `integration-*` y elimina sus soluciones y entradas de auditoría temporales al finalizar.
## Catalog media storage

Catalog images are uploaded by the authenticated admin API to the public-read Supabase Storage bucket configured by `Supabase__StorageBucket`. The service-role secret is backend-only and must never use a `VITE_` prefix or be committed.

Deletion uses a storage-first policy: the object is removed before its database row. This avoids untracked/orphaned objects when Storage fails. A rare database failure after a successful object deletion is returned as an error and requires operational repair of the stale row.

The upload limit is configured with `Media__MaxUploadBytes` (10 MiB by default). Real Storage integration tests are opt-in because they mutate and clean remote objects.
