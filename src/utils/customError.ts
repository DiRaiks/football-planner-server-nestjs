export function CustomError({ name, message }) {
  this.name = name || 'Custom Error';
  this.message = message || 'Unknown Error';
  // this.stack = (new Error()).stack;
}
CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;
