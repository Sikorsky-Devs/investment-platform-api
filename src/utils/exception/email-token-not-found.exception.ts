import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailTokenNotFoundException extends HttpException {
  constructor() {
    super('Email token not found', HttpStatus.NOT_FOUND);
  }
}
