import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilService } from 'src/shared/utils/utils.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          uri: configService.get<string>('DATABASE_URL'),
          autoIndex: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}