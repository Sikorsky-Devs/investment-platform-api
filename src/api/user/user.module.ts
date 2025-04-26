import { UserService } from './user.service';
import { FileModule } from '../../file/file.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../database/prisma.service';

@Module({
  providers: [UserService, PrismaService],
  imports: [FileModule, AuthModule],
  controllers: [UserController],
})
export class UserModule {}
