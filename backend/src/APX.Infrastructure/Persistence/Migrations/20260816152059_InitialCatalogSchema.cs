using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace APX.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCatalogSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "admin_users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    email = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: true),
                    phone = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    display_name = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    last_login_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_users", x => x.id);
                    table.CheckConstraint("ck_admin_users_destination", "email IS NOT NULL OR phone IS NOT NULL");
                });

            migrationBuilder.CreateTable(
                name: "modalities",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    slug = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_modalities", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "project_requests",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    company = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    email = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    phone = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    project_type = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    city = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    approximate_date = table.Column<DateOnly>(type: "date", nullable: true),
                    attendees = table.Column<int>(type: "integer", nullable: true),
                    message = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    source = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_requests", x => x.id);
                    table.CheckConstraint("ck_project_requests_attendees", "attendees IS NULL OR attendees >= 0");
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "service_categories",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    slug = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    short_description = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    icon = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: true),
                    image_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_categories", x => x.id);
                    table.CheckConstraint("ck_service_categories_slug", "length(trim(slug)) > 0");
                    table.CheckConstraint("ck_service_categories_sort_order", "sort_order >= 0");
                });

            migrationBuilder.CreateTable(
                name: "tags",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    slug = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "use_cases",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    slug = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_use_cases", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "audit_log",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    admin_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    entity_type = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    entity_id = table.Column<Guid>(type: "uuid", nullable: false),
                    action = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    before_json = table.Column<string>(type: "jsonb", nullable: true),
                    after_json = table.Column<string>(type: "jsonb", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    ip_address = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_log", x => x.id);
                    table.ForeignKey(
                        name: "FK_audit_log_admin_users_admin_user_id",
                        column: x => x.admin_user_id,
                        principalTable: "admin_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "admin_user_roles",
                columns: table => new
                {
                    admin_user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_user_roles", x => new { x.admin_user_id, x.role_id });
                    table.ForeignKey(
                        name: "FK_admin_user_roles_admin_users_admin_user_id",
                        column: x => x.admin_user_id,
                        principalTable: "admin_users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_admin_user_roles_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "roles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "solutions",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    category_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    slug = table.Column<string>(type: "character varying(220)", maxLength: 220, nullable: false),
                    eyebrow = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    short_description = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    price_mode = table.Column<string>(type: "character varying(24)", maxLength: 24, nullable: false),
                    price_from = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    price_to = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    currency = table.Column<string>(type: "char(3)", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    featured = table.Column<bool>(type: "boolean", nullable: false),
                    implementation_time = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    published_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    updated_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    deleted_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: true),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solutions", x => x.id);
                    table.CheckConstraint("ck_solutions_currency", "currency IS NULL OR length(currency) = 3");
                    table.CheckConstraint("ck_solutions_slug", "length(trim(slug)) > 0");
                    table.CheckConstraint("ck_solutions_sort_order", "sort_order >= 0");
                    table.ForeignKey(
                        name: "FK_solutions_service_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "service_categories",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "project_request_items",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    project_request_id = table.Column<Guid>(type: "uuid", nullable: false),
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    added_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false),
                    solution_name_snapshot = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_request_items", x => x.id);
                    table.CheckConstraint("ck_project_request_items_quantity", "quantity > 0");
                    table.ForeignKey(
                        name: "FK_project_request_items_project_requests_project_request_id",
                        column: x => x.project_request_id,
                        principalTable: "project_requests",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_request_items_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "solution_features",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(220)", maxLength: 220, nullable: false),
                    description = table.Column<string>(type: "character varying(800)", maxLength: 800, nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_features", x => x.id);
                    table.CheckConstraint("ck_solution_features_order", "sort_order >= 0");
                    table.ForeignKey(
                        name: "FK_solution_features_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "solution_media",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    storage_key = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    public_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    alt = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    media_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    mime_type = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    width = table.Column<int>(type: "integer", nullable: true),
                    height = table.Column<int>(type: "integer", nullable: true),
                    bytes = table.Column<long>(type: "bigint", nullable: true),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    is_cover = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTimeOffset>(type: "timestamptz", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_media", x => x.id);
                    table.CheckConstraint("ck_solution_media_dimensions", "(width IS NULL OR width > 0) AND (height IS NULL OR height > 0) AND (bytes IS NULL OR bytes >= 0)");
                    table.CheckConstraint("ck_solution_media_order", "sort_order >= 0");
                    table.ForeignKey(
                        name: "FK_solution_media_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "solution_modalities",
                columns: table => new
                {
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    modality_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_modalities", x => new { x.solution_id, x.modality_id });
                    table.ForeignKey(
                        name: "FK_solution_modalities_modalities_modality_id",
                        column: x => x.modality_id,
                        principalTable: "modalities",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_solution_modalities_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "solution_relations",
                columns: table => new
                {
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    related_solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_relations", x => new { x.solution_id, x.related_solution_id });
                    table.CheckConstraint("ck_solution_relations_not_self", "solution_id <> related_solution_id");
                    table.CheckConstraint("ck_solution_relations_order", "sort_order >= 0");
                    table.ForeignKey(
                        name: "FK_solution_relations_solutions_related_solution_id",
                        column: x => x.related_solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_solution_relations_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "solution_seo",
                columns: table => new
                {
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    meta_title = table.Column<string>(type: "character varying(240)", maxLength: 240, nullable: true),
                    meta_description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    canonical_url = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    robots = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    keywords = table.Column<string[]>(type: "text[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_seo", x => x.solution_id);
                    table.ForeignKey(
                        name: "FK_solution_seo_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "solution_tags",
                columns: table => new
                {
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    tag_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_tags", x => new { x.solution_id, x.tag_id });
                    table.ForeignKey(
                        name: "FK_solution_tags_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_solution_tags_tags_tag_id",
                        column: x => x.tag_id,
                        principalTable: "tags",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "solution_use_cases",
                columns: table => new
                {
                    solution_id = table.Column<Guid>(type: "uuid", nullable: false),
                    use_case_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_solution_use_cases", x => new { x.solution_id, x.use_case_id });
                    table.ForeignKey(
                        name: "FK_solution_use_cases_solutions_solution_id",
                        column: x => x.solution_id,
                        principalTable: "solutions",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_solution_use_cases_use_cases_use_case_id",
                        column: x => x.use_case_id,
                        principalTable: "use_cases",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_admin_user_roles_role_id",
                table: "admin_user_roles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "ux_admin_users_email",
                table: "admin_users",
                column: "email",
                unique: true,
                filter: "email IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "ux_admin_users_phone",
                table: "admin_users",
                column: "phone",
                unique: true,
                filter: "phone IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_audit_log_admin_user_id",
                table: "audit_log",
                column: "admin_user_id");

            migrationBuilder.CreateIndex(
                name: "ix_audit_log_entity",
                table: "audit_log",
                columns: new[] { "entity_type", "entity_id" });

            migrationBuilder.CreateIndex(
                name: "ux_modalities_slug",
                table: "modalities",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_project_request_items_project_request_id",
                table: "project_request_items",
                column: "project_request_id");

            migrationBuilder.CreateIndex(
                name: "IX_project_request_items_solution_id",
                table: "project_request_items",
                column: "solution_id");

            migrationBuilder.CreateIndex(
                name: "ix_project_requests_status",
                table: "project_requests",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ux_roles_name",
                table: "roles",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ux_service_categories_slug",
                table: "service_categories",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_solution_features_solution_id",
                table: "solution_features",
                column: "solution_id");

            migrationBuilder.CreateIndex(
                name: "ux_solution_media_single_cover",
                table: "solution_media",
                column: "solution_id",
                unique: true,
                filter: "is_cover = true");

            migrationBuilder.CreateIndex(
                name: "IX_solution_modalities_modality_id",
                table: "solution_modalities",
                column: "modality_id");

            migrationBuilder.CreateIndex(
                name: "IX_solution_relations_related_solution_id",
                table: "solution_relations",
                column: "related_solution_id");

            migrationBuilder.CreateIndex(
                name: "IX_solution_tags_tag_id",
                table: "solution_tags",
                column: "tag_id");

            migrationBuilder.CreateIndex(
                name: "IX_solution_use_cases_use_case_id",
                table: "solution_use_cases",
                column: "use_case_id");

            migrationBuilder.CreateIndex(
                name: "ix_solutions_category_order",
                table: "solutions",
                columns: new[] { "category_id", "sort_order" });

            migrationBuilder.CreateIndex(
                name: "ux_solutions_slug",
                table: "solutions",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ux_tags_slug",
                table: "tags",
                column: "slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ux_use_cases_slug",
                table: "use_cases",
                column: "slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin_user_roles");

            migrationBuilder.DropTable(
                name: "audit_log");

            migrationBuilder.DropTable(
                name: "project_request_items");

            migrationBuilder.DropTable(
                name: "solution_features");

            migrationBuilder.DropTable(
                name: "solution_media");

            migrationBuilder.DropTable(
                name: "solution_modalities");

            migrationBuilder.DropTable(
                name: "solution_relations");

            migrationBuilder.DropTable(
                name: "solution_seo");

            migrationBuilder.DropTable(
                name: "solution_tags");

            migrationBuilder.DropTable(
                name: "solution_use_cases");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "admin_users");

            migrationBuilder.DropTable(
                name: "project_requests");

            migrationBuilder.DropTable(
                name: "modalities");

            migrationBuilder.DropTable(
                name: "tags");

            migrationBuilder.DropTable(
                name: "solutions");

            migrationBuilder.DropTable(
                name: "use_cases");

            migrationBuilder.DropTable(
                name: "service_categories");
        }
    }
}
