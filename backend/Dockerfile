FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY backend/src/APX.Domain/APX.Domain.csproj backend/src/APX.Domain/
COPY backend/src/APX.Application/APX.Application.csproj backend/src/APX.Application/
COPY backend/src/APX.Infrastructure/APX.Infrastructure.csproj backend/src/APX.Infrastructure/
COPY backend/src/APX.Api/APX.Api.csproj backend/src/APX.Api/
RUN dotnet restore backend/src/APX.Api/APX.Api.csproj
COPY backend/src/ backend/src/
RUN dotnet publish backend/src/APX.Api/APX.Api.csproj -c Release --no-restore -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080 DOTNET_EnableDiagnostics=0
EXPOSE 8080
COPY --from=build /app/publish .
USER $APP_UID
ENTRYPOINT ["dotnet","APX.Api.dll"]
