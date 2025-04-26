import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailModule } from '../../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';

@Module({
  imports: [
    MailModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: process.env.TTL },
    }),
  ],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
