/* eslint-disable no-proto */

export class PhoRuntimeError extends Error {
  constructor (message) {
    super(message)
    this.constructor = PhoRuntimeError
    this.__proto__ = PhoRuntimeError.prototype
    Error.captureStackTrace(this, PhoRuntimeError)
  }
}

export class PhoNetworkError extends Error {
  constructor (message) {
    super(message)
    this.constructor = PhoNetworkError
    this.__proto__ = PhoNetworkError.prototype
    Error.captureStackTrace(this, PhoNetworkError)
  }
}

export class PhoAuthError extends Error {
  constructor (message) {
    super(message)
    this.constructor = PhoAuthError
    this.__proto__ = PhoAuthError.prototype
    Error.captureStackTrace(this, PhoAuthError)
  }
}

export class PhoPermissionError extends Error {
  constructor (message) {
    super(message)
    this.constructor = PhoPermissionError
    this.__proto__ = PhoPermissionError.prototype
    Error.captureStackTrace(this, PhoPermissionError)
  }
}
