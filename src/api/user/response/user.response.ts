import { Role } from '@prisma/client';

export class UserResponse {
  id: string;
  email: string;
  username: string;
  role: Role;
  avatarLink: string;
}
