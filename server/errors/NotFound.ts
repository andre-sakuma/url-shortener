import BaseError from '../errors'

export default class NotFound extends BaseError {
  status: number
  message: string
  constructor(message: string) {
    const status = 404
    super(status, message)
    this.status = status
    this.message = message
  }
}
