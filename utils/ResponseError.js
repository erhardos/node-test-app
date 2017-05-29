class ResponseError extends Error {

  constructor(msg, code, fileName, lineNumber) {
    super(msg, fileName, lineNumber)
    this.code = code
  }
}

module.exports = ResponseError