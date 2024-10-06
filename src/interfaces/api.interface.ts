export interface ApiResponse<D> {
    success: boolean;
    message: string;
    data?: []|D
}