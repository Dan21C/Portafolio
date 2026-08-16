# Arquitectura backend prevista

Este repositorio no implementa backend en la fase actual. La UI pública y el administrador consumen contratos compartidos desde `catalog-core` y usan repositorios mock reemplazables.

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

### Estado local temporal

`apx-project-selection` continúa siendo la persistencia del Project Builder. `clearProject()` limpia estado React, localStorage, drawer, contador y resumen tras una creación exitosa. La autenticación administrativa continúa usando temporalmente `apx-admin-auth`, aislada por `AdminProtectedRoute`.
