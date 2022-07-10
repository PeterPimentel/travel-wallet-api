export default class ApiError extends Error {
  // parent error
  statusCode: number;
  stack?: any;

  constructor(message: string, statusCode: number, stack?: any) {
    super();
    this.name = this.constructor.name; // good practice
    this.stack = stack;
    this.message = message; // detailed error message
    this.statusCode = statusCode;
  }
}

export class AuthError extends ApiError {}
