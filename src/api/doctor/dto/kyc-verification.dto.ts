import { IsBase64, IsEnum, IsString } from 'src/shared/decorators';
import { KycIdType, KycStatus } from '../enums';

export class KycDocsDto {
   @IsBase64(false)
   idDoc?: string;

   @IsEnum(KycIdType, false)
   idType?: KycIdType;

   @IsBase64(false)
   professionalCert?: string;

   idDocPublicId?: string;
   professionalCertPublicId?: string;
   status?: KycStatus;
}
