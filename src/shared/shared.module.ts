import { Module } from '@nestjs/common';
import { UtilService } from './utils/utils.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [UtilService],
  exports: [MailModule, UtilService],
})
export class SharedModule {}
