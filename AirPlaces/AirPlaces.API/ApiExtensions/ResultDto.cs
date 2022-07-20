using System.Collections.Immutable;

namespace AirPlaces.API.ApiExtensions;

public class ResultDto<T>
{
    public T Value { get; set; }
    public ImmutableArray<ErrorDto> Errors { get; set; } = ImmutableArray<ErrorDto>.Empty;
    public bool Success => Errors.Length == 0;
}