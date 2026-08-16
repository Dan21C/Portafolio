using APX.Domain.Admin;
using APX.Domain.Catalog;

namespace APX.Infrastructure.Persistence.Seed;

public static class CatalogSeedData
{
    private static readonly DateTimeOffset SeedTime = new(2026, 8, 1, 0, 0, 0, TimeSpan.Zero);
    public static readonly Guid AdminRoleId = Guid.Parse("70000000-0000-4000-8000-000000000001");
    public static readonly Guid EditorRoleId = Guid.Parse("70000000-0000-4000-8000-000000000002");
    public static readonly Guid ViewerRoleId = Guid.Parse("70000000-0000-4000-8000-000000000003");

    public static IReadOnlyList<Role> Roles => [new() { Id = AdminRoleId, Name = "Admin" }, new() { Id = EditorRoleId, Name = "Editor" }, new() { Id = ViewerRoleId, Name = "Viewer" }];

    public static IReadOnlyList<ServiceCategory> Categories =>
    [
        Category(1, "Experiencias interactivas", "experiencias-interactivas", "Experiencias que las personas juegan, viven y recuerdan.", "/Assets/About/experiencias-interactivas.png"),
        Category(2, "Hardware tecnológico", "hardware-tecnologico", "Tecnología física diseñada para experiencias y espacios.", "/Assets/About/hardware-displays.png"),
        Category(3, "Automatización e integraciones", "automatizacion-integraciones", "Procesos y herramientas que trabajan conectados.", "/Assets/About/automatizacion-integraciones.png"),
        Category(4, "IA aplicada", "ia-aplicada", "Inteligencia artificial integrada donde realmente genera valor.", "/Assets/About/ia-aplicada.png"),
        Category(5, "Analítica y datos", "analitica-datos", "Información convertida en decisiones.", "/Assets/About/analitica-datos.png"),
        Category(6, "Software a la medida", "software-medida", "Plataformas creadas alrededor de tu operación.", "/Assets/About/software-operacion.png")
    ];

    public static IReadOnlyList<Solution> Solutions
    {
        get
        {
            var groups = new[]
            {
                new[] { Item("APX Reflex Matrix", "Arena interactiva de velocidad y reflejos.", "/Assets/Products/apx-reflex-matrix.png"), Item("APX Vector Maze", "Desafío phygital de precisión y control.", "/Assets/Products/apx-vector-maze.png"), Item("APX Touch Duel", "Mesa multitáctil para retos cara a cara.", "/Assets/Products/apx-touch-duel.png"), Item("APX Imagine AI", "Experiencias generativas que convierten ideas en contenido.", "/Assets/Products/apx-imagine-ai.png"), Item("APX Balance Vision", "Experiencia interactiva controlada mediante visión artificial."), Item("Experiencia personalizada", "Mecánicas diseñadas alrededor de una marca o campaña.") },
                new[] { Item("APX HoloFrame", "Contenido holográfico controlado mediante gestos.", "/Assets/Products/apx-holoframe.png"), Item("APX Levitate", "Exhibición magnética para productos protagonistas.", "/Assets/Products/apx-levitate.png"), Item("Tótems interactivos", "Displays y puntos digitales de interacción."), Item("Pantallas y displays", "Soluciones visuales para activaciones y espacios."), Item("RFID / NFC", "Identificación, puntuación y trazabilidad para experiencias."), Item("Sensores e IoT", "Hardware conectado para medir e interactuar con espacios físicos.") },
                new[] { Item("Flujos automáticos", "Eliminamos tareas repetitivas mediante automatizaciones."), Item("Conectores API", "Integramos plataformas y sistemas existentes."), Item("Plugins personalizados", "Extensiones desarrolladas alrededor de procesos específicos."), Item("Reportes automáticos", "Información preparada y enviada sin intervención manual."), Item("Sincronización de plataformas", "Información consistente entre diferentes sistemas."), Item("Automatización de operaciones", "Flujos internos diseñados para reducir trabajo manual.") },
                new[] { Item("Asistentes virtuales", "Sistemas conversacionales para responder y acompañar usuarios."), Item("Visión artificial", "Detección y análisis de elementos del mundo físico."), Item("IA en plataformas", "Capacidades inteligentes integradas dentro de software existente."), Item("IA generativa", "Creación de imágenes, contenido y experiencias personalizadas."), Item("Clasificación inteligente", "Organización y análisis automático de información."), Item("Experiencias con IA", "Soluciones interactivas impulsadas mediante modelos generativos.") },
                new[] { Item("Medición en eventos físicos", "Métricas de tráfico, participación y comportamiento."), Item("Dashboards", "Información centralizada para entender resultados.", "/Assets/Products/apx-data-intelligence.png"), Item("Insights", "Interpretación de datos para encontrar oportunidades."), Item("Registro y captura de datos", "Formularios, QR y procesos de adquisición de información."), Item("Analítica de comportamiento", "Lectura de patrones de interacción."), Item("Reportes ejecutivos", "Información preparada para tomar decisiones.") },
                new[] { Item("Diseño y desarrollo web", "Experiencias digitales modernas y responsivas.", "/Assets/Products/apx-software-studio.png"), Item("Plataformas para eventos", "Registro, asistentes, actividades y operación."), Item("Software a la medida", "Herramientas construidas alrededor del proceso del cliente."), Item("Plataformas empresariales", "Sistemas internos para operación y administración."), Item("Aplicaciones web", "Productos digitales accesibles desde cualquier dispositivo."), Item("Sistemas operativos internos", "Software para digitalizar procesos empresariales.") }
            };
            var categoryNames = Categories.Select(category => category.Name).ToArray();
            var tags = Tags.ToDictionary(tag => tag.Name);
            var useCases = UseCases.ToArray(); var modalities = Modalities.ToArray(); var result = new List<Solution>();
            for (var categoryIndex = 0; categoryIndex < groups.Length; categoryIndex++)
            for (var itemIndex = 0; itemIndex < groups[categoryIndex].Length; itemIndex++)
            {
                var item = groups[categoryIndex][itemIndex]; var solution = Solution.Create(SolutionId(categoryIndex, itemIndex), CategoryId(categoryIndex + 1), item.Name, Slugify(item.Name), item.Description, $"{item.Description} Diseñamos su implementación alrededor del contexto, la audiencia y los objetivos de cada proyecto.");
                solution.Eyebrow = "Solución APX"; solution.PriceMode = PriceMode.Quote; solution.Currency = "COP"; solution.Featured = itemIndex == 0; solution.ImplementationTime = "Según alcance"; solution.SortOrder = itemIndex + 1; solution.SetStatus(SolutionStatus.Published, SeedTime);
                var featureNames = new[] { "Diseño a la medida", "Implementación APX", "Medición de resultados" };
                for (var featureIndex = 0; featureIndex < featureNames.Length; featureIndex++) solution.Features.Add(new SolutionFeature { Id = NestedId(3, categoryIndex, itemIndex, featureIndex), SolutionId = solution.Id, Title = featureNames[featureIndex], SortOrder = featureIndex + 1 });
                if (item.Image is not null) solution.Media.Add(new SolutionMedia { Id = NestedId(2, categoryIndex, itemIndex), SolutionId = solution.Id, PublicUrl = item.Image, Alt = item.Name, MediaType = MediaType.Image, SortOrder = 1, IsCover = true, CreatedAt = SeedTime });
                solution.SolutionTags.Add(new SolutionTag { SolutionId = solution.Id, TagId = tags[categoryNames[categoryIndex]].Id });
                foreach (var useCase in useCases) solution.SolutionUseCases.Add(new SolutionUseCase { SolutionId = solution.Id, UseCaseId = useCase.Id });
                foreach (var modality in modalities) solution.SolutionModalities.Add(new SolutionModality { SolutionId = solution.Id, ModalityId = modality.Id });
                solution.Seo = new SolutionSeo { SolutionId = solution.Id, MetaTitle = $"{item.Name} | APX", MetaDescription = item.Description, Keywords = [item.Name, "APX"] };
                result.Add(solution);
            }
            return result;
        }
    }

    public static IReadOnlyList<Tag> Tags => Categories.Select((category, index) => new Tag { Id = Guid.Parse($"40000000-0000-4000-8000-{index + 1:000000000000}"), Name = category.Name, Slug = category.Slug, IsActive = true }).ToArray();
    public static IReadOnlyList<UseCase> UseCases => [new() { Id = Guid.Parse("50000000-0000-4000-8000-000000000001"), Name = "Eventos", Slug = "eventos", SortOrder = 1 }, new() { Id = Guid.Parse("50000000-0000-4000-8000-000000000002"), Name = "Activaciones", Slug = "activaciones", SortOrder = 2 }, new() { Id = Guid.Parse("50000000-0000-4000-8000-000000000003"), Name = "Espacios de marca", Slug = "espacios-de-marca", SortOrder = 3 }];
    public static IReadOnlyList<Modality> Modalities => [new() { Id = Guid.Parse("60000000-0000-4000-8000-000000000001"), Name = "Renta", Slug = "renta", SortOrder = 1 }, new() { Id = Guid.Parse("60000000-0000-4000-8000-000000000002"), Name = "Personalización", Slug = "personalizacion", SortOrder = 2 }];

    private static ServiceCategory Category(int index, string name, string slug, string description, string image) => new() { Id = CategoryId(index), Name = name, Slug = slug, ShortDescription = description, Description = description, ImageUrl = image, SortOrder = index, IsActive = true, CreatedAt = SeedTime, UpdatedAt = SeedTime };
    private static (string Name, string Description, string? Image) Item(string name, string description, string? image = null) => (name, description, image);
    private static Guid CategoryId(int index) => Guid.Parse($"00000000-0000-4000-8000-{index:000000000000}");
    private static Guid SolutionId(int categoryIndex, int itemIndex) => Guid.Parse($"10000000-0000-4000-8{categoryIndex + 1:000}-{itemIndex + 1:000000000000}");
    private static Guid NestedId(int prefix, int categoryIndex, int itemIndex, int nestedIndex = 0) => Guid.Parse($"{prefix}0000000-0000-4000-8{categoryIndex + 1:000}-{(itemIndex + 1) * 100 + nestedIndex:000000000000}");
    private static string Slugify(string value) { var normalized = value.Normalize(System.Text.NormalizationForm.FormD); var chars = normalized.Where(character => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(character) != System.Globalization.UnicodeCategory.NonSpacingMark).Select(character => char.IsLetterOrDigit(character) ? char.ToLowerInvariant(character) : '-').ToArray(); return string.Join('-', new string(chars).Split('-', StringSplitOptions.RemoveEmptyEntries)); }
}
