namespace angularNet9.API.DTOs
{
    public class ServiceResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }

    public ServiceResponse() { }

    public ServiceResponse(bool success, string? message, T? data)
    {
        Success = success;
        Message = message;
        Data = data;
    }
    
    public ServiceResponse(bool success, string? message)
    {
        Success = success;
        Message = message;
        Data = default;
    }
}


}
