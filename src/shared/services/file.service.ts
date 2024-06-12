import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
   v2 as cloudinary,
   UploadApiOptions,
   UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class FileService {
   constructor(configService: ConfigService) {
      const apiKey = configService.get<string>('CLOUDINARY_API_KEY');
      const apiSecret = configService.get<string>('CLOUDINARY_API_ECRET');
      const cloudName = configService.get<string>('CLOUDINARY_CLOUD_NAME');

      cloudinary.config({
         api_key: apiKey,
         api_secret: apiSecret,
         cloud_name: cloudName,
      });
   }

   async uploadResource(
      file: string,
      options: UploadApiOptions = {},
   ): Promise<Pick<UploadApiResponse, 'url' | 'public_id'>> {
      try {
         const data = await cloudinary.uploader.upload(file, {
            ...options,
            folder: 'pendulum',
         });

         return { url: data.secure_url, public_id: data.public_id };
      } catch (error: any) {
         console.log(error);
         throw new BadRequestException(
            `Unable to upload resource to cloud ${error.message ?? error}`,
         );
      }
   }

   async deleteResource(
      public_id: string,
      options: UploadApiOptions = {},
   ): Promise<void> {
      try {
         await cloudinary.uploader.destroy(public_id, { ...options });
      } catch (error: any) {
         console.log(error);
         throw new BadRequestException(
            `Unable to delete resource from cloud ${error.message ?? error}`,
         );
      }
   }
}
