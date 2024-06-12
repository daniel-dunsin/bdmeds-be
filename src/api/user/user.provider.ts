import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './schema/user.schema';
import { UtilService } from 'src/shared/services/utils.service';
import { FileService } from 'src/shared/services/file.service';

@Injectable()
export class UserProvider {
   constructor(
      private readonly userService: UserService,
      private readonly utilService: UtilService,
      private readonly fileService: FileService,
   ) {}

   async getUser(user: UserDocument) {
      const data = await this.userService.getUser({ _id: user._id });

      if (!data) throw new NotFoundException('Profile not found');

      return {
         success: true,
         message: 'user info fetched',
         data: this.utilService.excludePassword(data),
      };
   }

   async updateProfilePicture(picture: string, userId: string) {
      const user = await this.userService.getUser({ _id: userId });
      if (!user) throw new NotFoundException('User does not exist');

      const profilePictureId = user.profilePictureId;

      const { url, public_id } = await this.fileService.uploadResource(picture);

      user.profilePicture = url;
      user.profilePictureId = public_id;
      await user.save();

      if (profilePictureId) {
         await this.fileService.deleteResource(profilePictureId);
      }

      return {
         success: true,
         message: 'profile picture uploaded successfully',
      };
   }
}
