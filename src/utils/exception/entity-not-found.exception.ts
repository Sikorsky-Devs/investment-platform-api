import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, field: string) {
    super(`${entity} with such ${field} not found`, HttpStatus.NOT_FOUND);
  }
}
