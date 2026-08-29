namespace APX.Domain.Catalog;

public enum SolutionStatus { Draft, Published, Archived }
public enum PriceMode { Quote, StartingAt, Range, Fixed, Contact }
public enum MediaType { Image, Video }

public static class CatalogEnumMappings
{
    public static string ToContract(this SolutionStatus value) => value switch { SolutionStatus.Draft => "draft", SolutionStatus.Published => "published", SolutionStatus.Archived => "archived", _ => throw new ArgumentOutOfRangeException(nameof(value)) };
    public static SolutionStatus ParseSolutionStatus(string value) => value switch { "draft" => SolutionStatus.Draft, "published" => SolutionStatus.Published, "archived" => SolutionStatus.Archived, _ => throw new ArgumentOutOfRangeException(nameof(value)) };
    public static string ToContract(this PriceMode value) => value switch { PriceMode.Quote => "quote", PriceMode.StartingAt => "startingAt", PriceMode.Range => "range", PriceMode.Fixed => "fixed", PriceMode.Contact => "contact", _ => throw new ArgumentOutOfRangeException(nameof(value)) };
    public static PriceMode ParsePriceMode(string value) => value switch { "quote" => PriceMode.Quote, "startingAt" => PriceMode.StartingAt, "range" => PriceMode.Range, "fixed" => PriceMode.Fixed, "contact" => PriceMode.Contact, _ => throw new ArgumentOutOfRangeException(nameof(value)) };
    public static string ToContract(this MediaType value) => value switch { MediaType.Image => "image", MediaType.Video => "video", _ => throw new ArgumentOutOfRangeException(nameof(value)) };
    public static MediaType ParseMediaType(string value) => value switch { "image" => MediaType.Image, "video" => MediaType.Video, _ => throw new ArgumentOutOfRangeException(nameof(value)) };
}
