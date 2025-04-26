import { ContactType } from '@prisma/client';

export class CreateContactDto {
  type: ContactType;
  content: string;
}
