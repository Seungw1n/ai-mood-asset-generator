export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred. Please try again.';
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes('api key') ||
           error.message.toLowerCase().includes('authentication') ||
           error.message.toLowerCase().includes('unauthorized');
  }
  return false;
};