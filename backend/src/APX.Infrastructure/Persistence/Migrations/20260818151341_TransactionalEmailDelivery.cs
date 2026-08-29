using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TransactionalEmailDelivery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "email_deliveries",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    type = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    recipient = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    related_entity_type = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    related_entity_id = table.Column<Guid>(type: "uuid", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    attempts = table.Column<int>(type: "integer", nullable: false),
                    last_attempt_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    sent_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    last_error_code = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_email_deliveries", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_email_deliveries_created_at",
                table: "email_deliveries",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_email_deliveries_related_entity_id",
                table: "email_deliveries",
                column: "related_entity_id");

            migrationBuilder.CreateIndex(
                name: "ix_email_deliveries_status",
                table: "email_deliveries",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_email_deliveries_type",
                table: "email_deliveries",
                column: "type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "email_deliveries");
        }
    }
}
