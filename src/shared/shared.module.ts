import { Module } from '@nestjs/common';
import { UtilService } from 'src/shared/services/utils.service';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileService } from './file/file.service';
import { v2 as cloudinary } from 'cloudinary';
import { FileProvider } from './file/file.provider';
import { ZoomModule } from './zoom/zoom.module';

@Module({
   imports: [ConfigModule, MailModule, ZoomModule],
   providers: [UtilService, FileProvider, FileService],
   exports: [MailModule, UtilService, FileService],
})
export class SharedModule {}
