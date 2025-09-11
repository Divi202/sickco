// lib/errors.ts

// Custom errors

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, 400);
  }
}

export class ExternalApiError extends AppError {
  constructor(message = 'External service failed') {
    super(message, 502);
  }
}

export class DBError extends AppError {
  constructor(message = 'Database error') {
    super(message, 500);
  }
}
