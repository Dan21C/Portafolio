namespace APX.Application.Common;

public enum ErrorType { NotFound, Validation, Conflict, Concurrency, Unauthorized, Forbidden, Unexpected }

public sealed record AppError(ErrorType Type, string Code, string Detail, IReadOnlyDictionary<string, string[]>? Errors = null);

public class Result
{
    protected Result(bool succeeded, AppError? error) { Succeeded = succeeded; Error = error; }
    public bool Succeeded { get; }
    public AppError? Error { get; }
    public static Result Success() => new(true, null);
    public static Result Failure(AppError error) => new(false, error);
}

public sealed class Result<T> : Result
{
    private Result(bool succeeded, T? value, AppError? error) : base(succeeded, error) => Value = value;
    public T? Value { get; }
    public static Result<T> Success(T value) => new(true, value, null);
    public static new Result<T> Failure(AppError error) => new(false, default, error);
}

public static class Errors
{
    public static AppError NotFound(string code, string detail) => new(ErrorType.NotFound, code, detail);
    public static AppError Validation(string detail, IReadOnlyDictionary<string, string[]> errors) => new(ErrorType.Validation, "validation_error", detail, errors);
    public static AppError Conflict(string code, string detail) => new(ErrorType.Conflict, code, detail);
    public static AppError Concurrency(string detail) => new(ErrorType.Concurrency, "concurrency_conflict", detail);
}
