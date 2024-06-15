import { BaseUpdateUserDto } from 'src/api/user/dto/update-user.dto';
import { IsDate } from 'src/shared/decorators';

export class UpdatePatientDto extends BaseUpdateUserDto {
   @IsDate(true)
   dateOfBirth?: Date;
}
