export interface ApiServiceResponse<T> {
    success: boolean;
    message: string;
    data: T;
}
