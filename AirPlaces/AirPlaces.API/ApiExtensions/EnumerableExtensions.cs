namespace AirPlaces.API.ApiExtensions;

public static class EnumerableExtensions
{
    public static string JoinStrings(this IEnumerable<string> strings, string separator)
    {
        return string.Join(separator, strings);
    }
}