import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ContactModule } from './api/contact/contact.module';

@Module({
  imports: [AuthModule, UserModule, ContactModule],
})
export class AppModule {}
