import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ContactModule } from './api/contact/contact.module';
import { ProjectModule } from './api/project/project.module';

@Module({
  imports: [AuthModule, UserModule, ContactModule, ProjectModule],
})
export class AppModule {}
