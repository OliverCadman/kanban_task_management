export class ResponseError extends Error {
  constructor(message, response, customMessage = null) {
    super(message, response);
    this.customMessage = customMessage;
  }
}
