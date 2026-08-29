using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AdminAuthentication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE UNIQUE INDEX ux_admin_users_email_normalized ON admin_users (lower(email)) WHERE email IS NOT NULL;");
            migrationBuilder.CreateTable(
                name: "admin_sessions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    admin_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    token_hash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    expires_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    last_seen_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    revoked_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    ip_address = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    user_agent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_sessions", x => x.id);
                    table.ForeignKey(
                        name: "FK_admin_sessions_admin_users_admin_user_id",
                        column: x => x.admin_user_id,
                        principalTable: "admin_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "otp_challenges",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    admin_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    channel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    destination = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    code_hash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    expires_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    attempts = table.Column<int>(type: "integer", nullable: false),
                    max_attempts = table.Column<int>(type: "integer", nullable: false),
                    consumed_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    locked_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    ip_address = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    user_agent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_otp_challenges", x => x.id);
                    table.CheckConstraint("ck_otp_attempts", "attempts >= 0 AND max_attempts > 0 AND attempts <= max_attempts");
                    table.CheckConstraint("ck_otp_channel", "channel = 'email'");
                    table.ForeignKey(
                        name: "FK_otp_challenges_admin_users_admin_user_id",
                        column: x => x.admin_user_id,
                        principalTable: "admin_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_admin_sessions_admin_user",
                table: "admin_sessions",
                column: "admin_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_admin_sessions_expires",
                table: "admin_sessions",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "ix_admin_sessions_revoked",
                table: "admin_sessions",
                column: "revoked_at");

            migrationBuilder.CreateIndex(
                name: "ux_admin_sessions_token_hash",
                table: "admin_sessions",
                column: "token_hash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_otp_challenges_admin_user",
                table: "otp_challenges",
                column: "admin_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_otp_challenges_consumed",
                table: "otp_challenges",
                column: "consumed_at");

            migrationBuilder.CreateIndex(
                name: "ix_otp_challenges_expires",
                table: "otp_challenges",
                column: "expires_at");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS ux_admin_users_email_normalized;");
            migrationBuilder.DropTable(
                name: "admin_sessions");

            migrationBuilder.DropTable(
                name: "otp_challenges");
        }
    }
}
