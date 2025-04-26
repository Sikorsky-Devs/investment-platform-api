import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityAlreadyExistsException extends HttpException {
  constructor(entity: string, field: string) {
    super(`${entity} with such ${field} already exists`, HttpStatus.CONFLICT);
  }
}
