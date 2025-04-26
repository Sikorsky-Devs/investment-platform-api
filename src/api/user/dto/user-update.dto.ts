export class UserUpdateDto {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  name?: string;
  description?: string;
  isApproved?: boolean;
  isLegal?: boolean;
  currentPassword?: string;
  newPassword?: string;
}
