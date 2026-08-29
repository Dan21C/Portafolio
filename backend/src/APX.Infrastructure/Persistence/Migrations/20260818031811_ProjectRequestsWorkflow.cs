using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ProjectRequestsWorkflow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_project_requests_status",
                table: "project_requests");

            migrationBuilder.DropCheckConstraint(
                name: "ck_project_requests_attendees",
                table: "project_requests");

            migrationBuilder.DropCheckConstraint(
                name: "ck_project_request_items_quantity",
                table: "project_request_items");

            migrationBuilder.DropColumn(
                name: "project_type",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "added_at",
                table: "project_request_items");

            migrationBuilder.DropColumn(
                name: "quantity",
                table: "project_request_items");

            migrationBuilder.RenameColumn(
                name: "source",
                table: "project_requests",
                newName: "privacy_policy_version");

            migrationBuilder.RenameColumn(
                name: "solution_name_snapshot",
                table: "project_request_items",
                newName: "solution_name");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "project_request_items",
                newName: "solution_description");

            migrationBuilder.RenameIndex(
                name: "IX_project_request_items_solution_id",
                table: "project_request_items",
                newName: "ix_project_request_items_solution_id");

            migrationBuilder.RenameIndex(
                name: "IX_project_request_items_project_request_id",
                table: "project_request_items",
                newName: "ix_project_request_items_request_id");

            migrationBuilder.CreateSequence(
                name: "project_request_number_seq");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "project_requests",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(80)",
                oldMaxLength: 80);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "project_requests",
                type: "character varying(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(180)",
                oldMaxLength: 180);

            migrationBuilder.AlterColumn<string>(
                name: "message",
                table: "project_requests",
                type: "character varying(3000)",
                maxLength: 3000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "company",
                table: "project_requests",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(180)",
                oldMaxLength: 180);

            migrationBuilder.AlterColumn<string>(
                name: "city",
                table: "project_requests",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(160)",
                oldMaxLength: 160);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "archived_at",
                table: "project_requests",
                type: "timestamptz",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "last_contacted_at",
                table: "project_requests",
                type: "timestamptz",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "lost_at",
                table: "project_requests",
                type: "timestamptz",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "privacy_accepted_at",
                table: "project_requests",
                type: "timestamptz",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "privacy_policy_url",
                table: "project_requests",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "qualified_at",
                table: "project_requests",
                type: "timestamptz",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "request_number",
                table: "project_requests",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "won_at",
                table: "project_requests",
                type: "timestamptz",
                nullable: true);

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "project_requests",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddColumn<string>(
                name: "category_name",
                table: "project_request_items",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "solution_slug",
                table: "project_request_items",
                type: "character varying(180)",
                maxLength: 180,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                UPDATE project_requests
                SET request_number = 'APX-' || LPAD(nextval('project_request_number_seq')::text, 6, '0'),
                    privacy_policy_version = 'legacy',
                    privacy_accepted_at = created_at,
                    status = CASE WHEN status = 'Closed' THEN 'Lost' ELSE status END;
                UPDATE project_request_items i
                SET solution_slug = s.slug,
                    category_name = c.name
                FROM solutions s
                JOIN service_categories c ON c.id = s.category_id
                WHERE i.solution_id = s.id;
                """);

            migrationBuilder.CreateTable(
                name: "project_request_status_history",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    project_request_id = table.Column<Guid>(type: "uuid", nullable: false),
                    previous_status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    new_status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    changed_by_admin_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_request_status_history", x => x.id);
                    table.ForeignKey(
                        name: "FK_project_request_status_history_admin_users_changed_by_admin~",
                        column: x => x.changed_by_admin_user_id,
                        principalTable: "admin_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_project_request_status_history_project_requests_project_req~",
                        column: x => x.project_request_id,
                        principalTable: "project_requests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_project_requests_created_at",
                table: "project_requests",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_project_requests_email",
                table: "project_requests",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "ix_project_requests_status_created_at",
                table: "project_requests",
                columns: new[] { "status", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ux_project_requests_request_number",
                table: "project_requests",
                column: "request_number",
                unique: true);

            migrationBuilder.AddCheckConstraint(
                name: "ck_project_requests_attendees",
                table: "project_requests",
                sql: "attendees IS NULL OR attendees > 0");

            migrationBuilder.CreateIndex(
                name: "ix_project_request_history_request_created",
                table: "project_request_status_history",
                columns: new[] { "project_request_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_project_request_status_history_changed_by_admin_user_id",
                table: "project_request_status_history",
                column: "changed_by_admin_user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "project_request_status_history");

            migrationBuilder.DropIndex(
                name: "ix_project_requests_created_at",
                table: "project_requests");

            migrationBuilder.DropIndex(
                name: "ix_project_requests_email",
                table: "project_requests");

            migrationBuilder.DropIndex(
                name: "ix_project_requests_status_created_at",
                table: "project_requests");

            migrationBuilder.DropIndex(
                name: "ux_project_requests_request_number",
                table: "project_requests");

            migrationBuilder.DropCheckConstraint(
                name: "ck_project_requests_attendees",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "archived_at",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "last_contacted_at",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "lost_at",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "privacy_accepted_at",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "privacy_policy_url",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "qualified_at",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "request_number",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "won_at",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "project_requests");

            migrationBuilder.DropColumn(
                name: "category_name",
                table: "project_request_items");

            migrationBuilder.DropColumn(
                name: "solution_slug",
                table: "project_request_items");

            migrationBuilder.DropSequence(
                name: "project_request_number_seq");

            migrationBuilder.RenameColumn(
                name: "privacy_policy_version",
                table: "project_requests",
                newName: "source");

            migrationBuilder.RenameColumn(
                name: "solution_name",
                table: "project_request_items",
                newName: "solution_name_snapshot");

            migrationBuilder.RenameColumn(
                name: "solution_description",
                table: "project_request_items",
                newName: "notes");

            migrationBuilder.RenameIndex(
                name: "ix_project_request_items_solution_id",
                table: "project_request_items",
                newName: "IX_project_request_items_solution_id");

            migrationBuilder.RenameIndex(
                name: "ix_project_request_items_request_id",
                table: "project_request_items",
                newName: "IX_project_request_items_project_request_id");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "project_requests",
                type: "character varying(80)",
                maxLength: 80,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "project_requests",
                type: "character varying(180)",
                maxLength: 180,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "message",
                table: "project_requests",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(3000)",
                oldMaxLength: 3000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "company",
                table: "project_requests",
                type: "character varying(180)",
                maxLength: 180,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "city",
                table: "project_requests",
                type: "character varying(160)",
                maxLength: 160,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(120)",
                oldMaxLength: 120);

            migrationBuilder.AddColumn<string>(
                name: "project_type",
                table: "project_requests",
                type: "character varying(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "added_at",
                table: "project_request_items",
                type: "timestamptz",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<int>(
                name: "quantity",
                table: "project_request_items",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "ix_project_requests_status",
                table: "project_requests",
                column: "status");

            migrationBuilder.AddCheckConstraint(
                name: "ck_project_requests_attendees",
                table: "project_requests",
                sql: "attendees IS NULL OR attendees >= 0");

            migrationBuilder.AddCheckConstraint(
                name: "ck_project_request_items_quantity",
                table: "project_request_items",
                sql: "quantity > 0");
        }
    }
}
