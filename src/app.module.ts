import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { ContactModule } from './api/contact/contact.module';
import { ProjectModule } from './api/project/project.module';
import { MessageModule } from './api/message/message.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ContactModule,
    ProjectModule,
    MessageModule,
  ],
})
export class AppModule {}
