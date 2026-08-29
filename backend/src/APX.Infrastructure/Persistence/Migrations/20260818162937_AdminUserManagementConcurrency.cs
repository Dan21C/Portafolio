using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AdminUserManagementConcurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "admin_users",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.Sql("CREATE UNIQUE INDEX IF NOT EXISTS ux_admin_users_email_normalized ON admin_users (lower(email)) WHERE email IS NOT NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS ux_admin_users_email_normalized;");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "admin_users");
        }
    }
}
