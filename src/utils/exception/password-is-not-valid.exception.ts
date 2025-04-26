import { HttpException, HttpStatus } from '@nestjs/common';

export class PasswordIsNotValidException extends HttpException {
  constructor() {
    super('Password is not valid', HttpStatus.CONFLICT);
  }
}
