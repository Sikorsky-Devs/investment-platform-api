import { Injectable } from '@nestjs/common';
import { FileService } from '../../file/file.service';
import { UserUpdateDto } from './dto/user-update.dto';
import * as bcrypt from 'bcryptjs';
import { PasswordIsNotValidException } from '../../utils/exception/password-is-not-valid.exception';
import { Prisma, Role } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly fileService: FileService,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async updateAvatar(file: Express.Multer.File, userId: string) {
    const link = this.fileService.uploadFile(file);
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user.avatarLink) {
      this.fileService.deleteFile(user.avatarLink);
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarLink: link },
    });
    return { link };
  }

  async update(
    { currentPassword, newPassword, ...dto }: UserUpdateDto,
    userId: string,
  ) {
    const data: Prisma.UserUpdateInput = { ...dto };
    if (newPassword && currentPassword) {
      const user = await this.prisma.user.findFirst({ where: { id: userId } });
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new PasswordIsNotValidException();
      }
      data.password = await this.authService.hashPassword(newPassword);
    }
    return this.prisma.user.update({
      where: { id: userId },
      data,
      omit: {
        password: true,
      },
    });
  }

  async getMany() {
    const users = await this.prisma.user.findMany({});
    const result = [];
    for (const user of users) {
      if (user.role !== Role.ADMIN) {
        delete user.password;
        result.push(user);
      }
    }
    return result;
  }

  async deleteById(userId: string) {
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });
    delete user.password;
    if (user.avatarLink) this.fileService.deleteFile(user.avatarLink);
    return user;
  }
}
