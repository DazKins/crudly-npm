export class CrudlyError extends Error {
  constructor(msg: string) {
    super(`crudly error: ${msg}`);
    Object.setPrototypeOf(this, CrudlyError.prototype);
  }
}

export class CrudlyValidationError extends CrudlyError {
  constructor(public reason: string) {
    super(`validation error, reason: ${reason}`);
    Object.setPrototypeOf(this, CrudlyValidationError.prototype);
  }
}

export class CrudlyRateLimitExceededError extends CrudlyError {
  constructor() {
    super("rate limit exceeded");
    Object.setPrototypeOf(this, CrudlyRateLimitExceededError.prototype);
  }
}

export class CrudlyNotFoundError extends CrudlyError {
  constructor() {
    super("not found");
    Object.setPrototypeOf(this, CrudlyNotFoundError.prototype);
  }
}

export class CrudlyUnexpectedError extends CrudlyError {
  constructor(public message: string) {
    super(`unexpected error, message: ${message}`);
    Object.setPrototypeOf(this, CrudlyUnexpectedError.prototype);
  }
}
