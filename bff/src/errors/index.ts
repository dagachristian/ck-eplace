type ErrorType = {
  msg: string,
  code: number
}

export const Errors: {[key: string]: ErrorType} = Object.freeze({
  UNAUTHORIZED: {
    msg: 'Invalid credentials',
    code: 401
  },
  NOT_EXIST: {
    msg: 'Requested entity does not exist',
    code: 404
  },
  EXISTS: {
    msg: 'Already exists',
    code: 409
  },
  API: {
    msg: 'Internal server error',
    code: 500
  }
})

export class ApiError extends Error {
  #type;
  #data;

  get type() { return this.#type }

  get data() { return this.#data }

  constructor(err: ErrorType, data?: any) {
    super(err.msg);
    this.#type = err;
    this.#data = data;
  }
}