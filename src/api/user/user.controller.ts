import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { Role } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@ApiTags('User')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/avatars/upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    return this.userService.updateAvatar(file, req['user'].id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  update(@Body() body: UserUpdateDto, @Param('id') id: string) {
    return this.userService.update(body, id);
  }

  @Get()
  @UseGuards(AuthGuard(Role.ADMIN))
  getMany() {
    return this.userService.getMany();
  }

  @Delete('/:id')
  @UseGuards(AuthGuard(Role.ADMIN))
  delete(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
