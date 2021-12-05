import BaseError from '../errors'

export default class BadRequest extends BaseError {
  status: number
  message: string
  constructor(message: string) {
    const status = 400
    super(status, message)
    this.status = status
    this.message = message
  }
}
