using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CatalogApiIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "ix_solutions_featured_order",
                table: "solutions",
                columns: new[] { "featured", "sort_order" });

            migrationBuilder.CreateIndex(
                name: "ix_solutions_status_order",
                table: "solutions",
                columns: new[] { "status", "sort_order" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_solutions_featured_order",
                table: "solutions");

            migrationBuilder.DropIndex(
                name: "ix_solutions_status_order",
                table: "solutions");
        }
    }
}
