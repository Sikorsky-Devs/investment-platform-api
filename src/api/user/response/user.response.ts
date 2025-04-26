import { Role } from '@prisma/client';

export class UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  name: string;
  description: string;
  role: Role;
  isApproved: boolean;
  isLegal: boolean;
  avatarLink: string;
}
