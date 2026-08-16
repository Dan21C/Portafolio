using APX.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace APX.Api;

internal static class ApiResultExtensions
{
    public static IResult ToHttp<T>(this Result<T> result, Func<T, IResult>? success = null) => result.Succeeded ? (success?.Invoke(result.Value!) ?? Results.Ok(result.Value)) : ToProblem(result.Error!);
    public static IResult ToHttp(this Result result, Func<IResult>? success = null) => result.Succeeded ? (success?.Invoke() ?? Results.NoContent()) : ToProblem(result.Error!);
    private static IResult ToProblem(AppError error)
    {
        var status = error.Type switch { ErrorType.Validation => 400, ErrorType.NotFound => 404, ErrorType.Conflict or ErrorType.Concurrency => 409, ErrorType.Unauthorized => 401, ErrorType.Forbidden => 403, _ => 500 };
        var problem = new ProblemDetails { Type = $"https://apx.local/problems/{error.Code}", Title = error.Type == ErrorType.Concurrency ? "Concurrency conflict" : $"{error.Type} error", Status = status, Detail = error.Detail };
        problem.Extensions["code"] = error.Code; if (error.Errors is not null) problem.Extensions["errors"] = error.Errors;
        return Results.Problem(problem);
    }
}
