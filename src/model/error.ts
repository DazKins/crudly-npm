export type CrudlyValidationError = {
  reason: string;
};
export type CrudlyEntityNotFoundError = {};
export type CrudlyRateLimitExceededError = {};
export type CrudlyUnexpectedError = {
  message: string;
};
