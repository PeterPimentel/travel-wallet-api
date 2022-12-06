export default class ApiError extends Error {
  // parent error
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super();
    this.name = this.constructor.name; // good practice
    this.code = code;
    this.message = message; // detailed error message
    this.statusCode = statusCode;
  }
}

export class AuthError extends ApiError { }
