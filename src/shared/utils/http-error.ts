export class HttpError extends Error {
  status: number;
  errors?: any;

  constructor(message: string, status: number = 500, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
