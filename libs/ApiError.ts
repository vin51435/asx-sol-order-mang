/**
 * Custom API error class for consistent error handling in Next.js App Router.
 */
export default class ApiError extends Error {
  public statusCode: number;
  public status: 'info' | 'success' | 'redirect' | 'fail' | 'server_error';
  public isOperational: boolean;
  public errorCode?: string; // Optional internal error code
  public redirectUrl?: string | null;

  /**
   * Constructor for ApiError
   * @param {string} message - The error message.
   * @param {number} [statusCode=500] - The HTTP status code.
   * @param {string} [errorCode] - Optional internal error code.
   * @param {string | null} [redirectUrl] - Optional redirect URL.
   */
  constructor(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    redirectUrl?: string | null,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = ApiError.determineStatus(statusCode);
    this.isOperational = true;
    this.errorCode = errorCode;
    this.redirectUrl = redirectUrl;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Maps status codes to semantic labels.
   */
  private static determineStatus(
    statusCode: number,
  ): 'info' | 'success' | 'redirect' | 'fail' | 'server_error' {
    if (statusCode >= 100 && statusCode < 200) return 'info';
    if (statusCode >= 200 && statusCode < 300) return 'success';
    if (statusCode >= 300 && statusCode < 400) return 'redirect';
    if (statusCode >= 400 && statusCode < 500) return 'fail';
    return 'server_error';
  }
}

