export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database'
  
  constructor() {
    super()

    // When extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
}