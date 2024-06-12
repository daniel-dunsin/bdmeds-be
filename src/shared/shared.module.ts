import { Module } from '@nestjs/common';
import { UtilService } from 'src/shared/services/utils.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './services/file.service';

@Module({
   imports: [ConfigModule, MailModule],
   providers: [UtilService, FileService],
   exports: [MailModule, UtilService, FileService],
})
export class SharedModule {}
