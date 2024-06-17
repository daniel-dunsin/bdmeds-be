import { IsEnum } from 'src/shared/decorators';
import { KycStatus } from '../enums';

export class GetKycDto {
   @IsEnum(KycStatus, true)
   status?: KycStatus;
}
