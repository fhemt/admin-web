export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, status: number, message?: string) {
    super(message ?? code);
    this.code = code;
    this.status = status;
    this.name = "ApiError";
  }
}

/** Thrown when the access token is missing/invalid/expired and the refresh
 * attempt also failed — callers should redirect to /login. */
export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired");
    this.name = "SessionExpiredError";
  }
}
