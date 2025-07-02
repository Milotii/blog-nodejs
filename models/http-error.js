class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // super calls the constructor of base class (Error) in our case
        this.code = errorCode; // adds a 'code' property
    }
}

module.exports = HttpError;