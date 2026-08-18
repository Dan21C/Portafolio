# Arquitectura backend prevista

La Fase 2A implementa la base de dominio y persistencia del backend. La UI pública y el administrador aún consumen contratos compartidos desde `catalog-core` y conservan sus repositorios mock reemplazables; la conexión HTTP queda reservada para una fase posterior.

## Plataforma objetivo

- ASP.NET Core sobre .NET 10.
- Arquitectura modular: `Catalog`, `Categories`, `Media`, `ProjectBuilder`, `Requests`, `Authentication` y `Admin`.
- Entity Framework Core con PostgreSQL administrado en Supabase.
- Supabase Storage para imágenes y video.
- Autenticación mediante códigos de un solo uso; el proveedor concreto se definirá en la fase backend.

La UI dependerá de interfaces de repositorio. `MockCatalogRepository`, `MockAdminCatalogRepository` y `MockAuthRepository` serán sustituidos por adaptadores API sin cambiar los componentes.

## Contrato HTTP previsto

### Público

```http
GET /api/catalog/categories
GET /api/catalog/categories/{slug}
GET /api/catalog/solutions
GET /api/catalog/solutions/{slug}
GET /api/catalog/featured
```

### Proyectos

```http
POST /api/project-requests
```

El cuerpo seguirá `ProjectRequest`; la API asignará identidad, fecha, estado y trazabilidad.

### Administración

```http
GET    /api/admin/solutions
POST   /api/admin/solutions
PUT    /api/admin/solutions/{id}
DELETE /api/admin/solutions/{id}
POST   /api/admin/media
GET    /api/admin/categories
POST   /api/admin/categories
PUT    /api/admin/categories/{id}
```

### Autenticación

```http
POST /api/auth/request-code
POST /api/auth/verify-code
```

## Límites de responsabilidad

React nunca accederá directamente a PostgreSQL ni a Storage. La API validará permisos, datos, publicación, archivos y rate limits. El sitio público solo recibirá contenido publicado; las operaciones administrativas exigirán autorización y auditoría. Los archivos se cargarán mediante la API o URLs firmadas definidas por ella.

## FRONTEND CONTRACT FREEZE

Esta sección congela la frontera que deberá respetar la primera implementación de la API. Los contratos compilables viven en `catalog-core/` y se verifican mediante `npm run typecheck`.

### Modelos de dominio

- `ServiceCategory`, `Solution`, `SolutionMedia`, `SolutionFeature`, `ProjectSelection`, `ProjectRequest` y `AuthSession` están en `catalog-core/models.ts`.
- `Solution.status` usa `draft | published | archived`; `published` booleano solo se reconoce en el adaptador de migración de localStorage antiguo.
- Todos los IDs del seed son UUID válidos y determinísticos. Las entidades nuevas mock usan `crypto.randomUUID()`.
- `Solution.gallery` es la fuente de verdad de media. El cover se identifica con `SolutionMedia.isCover` y se obtiene mediante `getSolutionCover()`.
- `SolutionMedia` admite `storageKey`, `mimeType`, `width`, `height` y `bytes` para la fase Storage.
- `ProjectRequest.approximateDate` es `string | null | undefined`; `attendees` es `number | null | undefined`.
- `PriceMode` se conserva y `Solution.currency` queda disponible sin introducir precios reales.

### DTOs congelados

`catalog-core/contracts.ts` define `PagedResult<T>`, queries de catálogo/admin y los DTOs públicos, administrativos, de proyecto, autenticación y media. Los DTOs no son entidades C# ni modelos de persistencia; son el contrato de transporte.

### Repositories

`catalog-core/repositories.ts` contiene `CatalogRepository`, `AdminCatalogRepository`, `ProjectRequestRepository`, `ProjectStorage`, `AuthRepository` y `MediaRepository`. Los mocks y stubs `Api*Repository` implementan estas interfaces. Mock es la configuración predeterminada; el punto de sustitución está en los exports de instancia de cada SPA.

### Mapping

`catalog-core/mappers.ts` separa payload y dominio mediante `mapSolutionDetail`, `mapCreateSolutionRequest` y `mapCreateProjectRequest`. Los componentes no deben consumir payloads HTTP directamente.

### Endpoints esperados

Los paths documentados arriba se versionarán como `/api/v1/...` al implementar backend. Las consultas de soluciones deberán aceptar búsqueda, categoría, estado, featured, orden y paginación representados por `CatalogSolutionQuery` y `AdminSolutionQuery`.

## Fase 2A implementada

La solucion `backend/APX.sln` separa `APX.Domain`, `APX.Application`, `APX.Infrastructure` y `APX.Api`. Entity Framework Core modela catalogo, solicitudes de proyecto, administracion y auditoria sobre PostgreSQL. La migracion inicial crea indices, restricciones, relaciones, borrado logico y concurrencia optimista mediante `xmin`.

El seed idempotente conserva los UUID del frontend, 6 categorias, 36 soluciones y los roles `Admin`, `Editor` y `Viewer`. No contiene usuarios ni secretos. La API solo publica `GET /health`; no hay endpoints de catalogo, autenticacion ni integracion con Storage en esta fase.

La configuracion y los comandos operativos se documentan en `backend/README.md`. Los slugs se almacenan en minusculas y deben normalizarse en la futura capa Application/API. PostgreSQL sera la fuente de verdad una vez que los repositorios mock se sustituyan por adaptadores HTTP.

## Fase 2B - Catalog API

La API implementa el flujo Endpoint -> Application service -> repository de infraestructura -> EF Core. Los endpoints nunca acceden directamente al `ApxDbContext`. Los contratos HTTP usan DTOs camelCase y errores ProblemDetails; las entidades EF no se serializan.

El catalogo publico filtra exclusivamente contenido publicado, no eliminado y con categoria activa. La administracion permanece sin autenticacion solo como capacidad local: requiere simultaneamente entorno Development y `Features:EnableUnsafeDevelopmentAdminApi=true`. En Production las rutas admin no se registran incluso si alguien configura el flag por error.

El frontend sigue utilizando `MockCatalogRepository` y `MockAdminCatalogRepository`. La sustitucion por adaptadores HTTP, Storage y autenticacion quedan fuera de esta fase.

## Fase 2B.5 - PostgreSQL real

Las migraciones `InitialCatalogSchema` y `CatalogApiIndexes` fueron validadas contra PostgreSQL alojado en Supabase mediante Npgsql, sin SDK de Supabase. La suite `PostgresIntegrationTests` cubre esquema, seed, `ILIKE`, indices, transacciones, restricciones unique, soft delete, auditoria y concurrencia `xmin`; se omite de forma segura cuando no existe `APX_TEST_CONNECTION_STRING`.

La validacion real detecto y corrigio el tracking de hijos durante `PUT`: el reemplazo ahora elimina las colecciones con operaciones set-based dentro de la transaccion y marca explicitamente los nuevos UUID como `Added`. Los fixtures `integration-*` y `api-integration-*` se limpian al terminar.

## Fase 2C - Integracion del catalogo publico

El sitio publico selecciona `ApiCatalogRepository` solo cuando `VITE_USE_API=true` y existe `VITE_API_URL`; de lo contrario conserva `MockCatalogRepository`. El adaptador usa fetch nativo, mapea DTOs a dominio y preserva ProblemDetails mediante un error tipado. Search, categoria, sort y paginacion se ejecutan en la API, con debounce y cancelacion de requests en React.

Las paginas de categoria y detalle consultan sus endpoints dedicados y distinguen 404 de errores de red. El administrador, ProjectRequest, Storage y Auth permanecen sin conexion real. Los paths `/Assets/...` siguen siendo URLs locales validas hasta la fase de Storage.

## Fase 2E - autenticacion administrativa

El backend implementa OTP por email con HMAC-SHA256 y pepper del servidor, challenges de un solo uso, cooldown e intentos persistidos. Una verificacion correcta crea una sesion opaca nueva; la cookie HttpOnly contiene el token aleatorio y PostgreSQL almacena solo su hash. Todos los endpoints `/api/v1/admin/**` usan el esquema `AdminSession` y policies de permisos para Admin, Editor y Viewer.

Las mutaciones con cookie validan `Origin` o `Referer` contra los origenes CORS configurados. El rate limiter HTTP es por instancia y se complementa con estado PostgreSQL. React Admin permanece en mocks hasta Fase 2F; no usa aun estas cookies ni endpoints.

## Fase 2F - integracion del panel administrador

El Admin selecciona conjuntamente `ApiAuthRepository`, `ApiAdminCatalogRepository` y `ApiMediaRepository` cuando `VITE_USE_API=true` y existe `VITE_API_URL`. El cliente compartido usa `credentials: include`, conserva ProblemDetails y notifica globalmente los 401 sin convertir los 403 en logout.

La sesion se recupera con `/api/v1/auth/me`; no existe autenticacion en localStorage. Listados, editor, categorias, publicacion y media consumen la API real. Los previews `blob:` solo existen antes del upload y nunca se envian como metadatos persistentes. Solicitudes, proyectos, usuarios y metricas permanecen fuera de esta fase.

### Estado local temporal

`apx-project-selection` continúa siendo la persistencia del Project Builder. `clearProject()` limpia estado React, localStorage, drawer, contador y resumen tras una creación exitosa. La autenticación administrativa continúa usando temporalmente `apx-admin-auth`, aislada por `AdminProtectedRoute`.
