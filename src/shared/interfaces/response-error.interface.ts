export interface ResponseError {
  status: number;
  message: string;
  errors: string | Record<string, any>;
  timestamp: string;
}
