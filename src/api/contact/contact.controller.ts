import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req, Get,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Request } from 'express';

@Controller('/contacts')
@UseGuards(AuthGuard())
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('/:userId')
  getUserContacts(@Param('userId') userId: string) {
    return this.contactService.getUserContact(userId);
  }

  @UseGuards(AuthGuard())
  @Post()
  create(@Body() createContactDto: CreateContactDto, @Req() req: Request) {
    return this.contactService.create(createContactDto, req['user'].id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
