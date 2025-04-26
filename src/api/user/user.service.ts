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

  async getMany(email?: string) {
    const users = await this.prisma.user.findMany({
      where: {
        email: {
          startsWith: email,
        },
      },
    });
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

  async getUserInvestments(userId: string) {
    const investments = await this.prisma.investment.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            project: {
              include: {
                photos: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return investments.map((i) => ({
      id: i.product.project.id,
      name: i.product.project.name,
      description: i.product.project.description,
      photoLink: i.product.project.photos.find((p) => p.isMain)?.link,
      productName: i.product.name,
      investmentId: i.id,
      amount: i.amount,
      createdAt: i.createdAt,
    }));
  }

  async getUserChats(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          omit: {
            password: true,
          },
        },
        receiver: {
          omit: {
            password: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    const chats = [];
    for (const message of messages) {
      const chat = chats.find(
        (c) =>
          (c.senderId === message.senderId &&
            c.receiverId === message.receiverId) ||
          (c.senderId === message.receiverId &&
            c.receiverId === message.senderId),
      );
      if (!chat) {
        const entity =
          userId === message.senderId ? message.receiver : message.sender;
        chats.push({
          userId: entity.id,
          firstName: entity.firstName,
          middleName: entity.middleName,
          lastName: entity.lastName,
          name: entity.name,
          avatarLink: entity.avatarLink,
        });
      }
    }
    return chats;
  }
}
