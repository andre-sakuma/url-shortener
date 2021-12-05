import BaseError from '../errors'

export default class Unauthorized extends BaseError {
  status: number
  message: string
  constructor(message: string) {
    const status = 401
    super(status, message)
    this.status = status
    this.message = message
  }
}
