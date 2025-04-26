import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
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
  };

  async getHistory(senderId: string, receiverId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      ...this.include,
      orderBy: { createdAt: 'asc' },
    });
  }

  async saveMessage(senderId: string, receiverId: string, content: string) {
    return this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      ...this.include,
    });
  }

  genSocketGroupId(senderId: string, receiverId: string) {
    const sorted = [senderId, receiverId].sort();
    return `${sorted[0]}-${sorted[1]}`;
  }
}
