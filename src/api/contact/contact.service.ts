import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../../database/prisma.service';
import { EntityNotFoundException } from '../../utils/exception/entity-not-found.exception';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateContactDto, userId: string) {
    return this.prisma.contact.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, data: UpdateContactDto) {
    const contact = await this.prisma.contact.findFirst({ where: { id } });
    if (!contact) {
      throw new EntityNotFoundException('Contact', 'id');
    }
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const contact = await this.prisma.contact.findFirst({ where: { id } });
    if (!contact) {
      throw new EntityNotFoundException('Contact', 'id');
    }
    return this.prisma.contact.delete({ where: { id } });
  }
}
