export class HttpError extends Error {
  public status: number;
  public errors?: Record<string, string[]>; 

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors; 
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}