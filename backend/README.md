# APX Backend - Fase 2A

Base de persistencia para APX construida como monolito modular con ASP.NET Core 10, Entity Framework Core y PostgreSQL. En esta fase no se exponen endpoints de catalogo, no se integra Supabase Storage y no se implementa autenticacion. El frontend continua usando sus repositorios mock.

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
