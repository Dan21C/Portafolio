using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DashboardReportingIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_project_requests_contacted_created_at",
                table: "project_requests",
                columns: new[] { "last_contacted_at", "created_at" });
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS ix_project_requests_uncontacted_created_at ON project_requests (created_at) WHERE last_contacted_at IS NULL AND status IN ('New','InReview');");
            migrationBuilder.Sql("CREATE INDEX IF NOT EXISTS ix_project_requests_city_normalized_created_at ON project_requests (lower(city), created_at);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS ix_project_requests_city_normalized_created_at;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS ix_project_requests_uncontacted_created_at;");
            migrationBuilder.DropIndex(
                name: "ix_project_requests_contacted_created_at",
                table: "project_requests");
        }
    }
}
