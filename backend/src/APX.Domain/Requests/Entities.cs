using APX.Domain.Admin;
using APX.Domain.Catalog;
namespace APX.Domain.Requests;
public enum ProjectRequestStatus { New, InReview, Contacted, Qualified, Won, Lost, Archived }
public sealed class ProjectRequest
{
    public Guid Id { get; set; } public string RequestNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty; public string? Company { get; set; } public string Email { get; set; } = string.Empty; public string Phone { get; set; } = string.Empty; public string City { get; set; } = string.Empty;
    public DateOnly? ApproximateDate { get; set; } public int? Attendees { get; set; } public string? Message { get; set; } public ProjectRequestStatus Status { get; set; } = ProjectRequestStatus.New;
    public DateTimeOffset PrivacyAcceptedAt { get; set; } public string PrivacyPolicyVersion { get; set; } = string.Empty; public string? PrivacyPolicyUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; } public DateTimeOffset UpdatedAt { get; set; } public DateTimeOffset? LastContactedAt { get; set; } public DateTimeOffset? QualifiedAt { get; set; } public DateTimeOffset? WonAt { get; set; } public DateTimeOffset? LostAt { get; set; } public DateTimeOffset? ArchivedAt { get; set; } public uint Version { get; set; }
    public ICollection<ProjectRequestItem> Items { get; } = new List<ProjectRequestItem>(); public ICollection<ProjectRequestStatusHistory> StatusHistory { get; } = new List<ProjectRequestStatusHistory>();
}
public sealed class ProjectRequestItem
{
    public Guid Id { get; set; } public Guid ProjectRequestId { get; set; } public ProjectRequest ProjectRequest { get; set; } = null!; public Guid SolutionId { get; set; } public Solution Solution { get; set; } = null!;
    public string SolutionName { get; set; } = string.Empty; public string SolutionSlug { get; set; } = string.Empty; public string CategoryName { get; set; } = string.Empty; public string? SolutionDescription { get; set; }
}
public sealed class ProjectRequestStatusHistory
{
    public Guid Id { get; set; } public Guid ProjectRequestId { get; set; } public ProjectRequest ProjectRequest { get; set; } = null!; public ProjectRequestStatus? PreviousStatus { get; set; } public ProjectRequestStatus NewStatus { get; set; }
    public Guid? ChangedByAdminUserId { get; set; } public AdminUser? ChangedByAdminUser { get; set; } public DateTimeOffset CreatedAt { get; set; }
}
