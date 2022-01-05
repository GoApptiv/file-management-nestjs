export interface ResponseError {
  success: boolean;
  message: string;
  errors: string | Record<string, any>;
  timestamp: number;
}
