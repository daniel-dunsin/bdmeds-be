import { IsString } from 'src/shared/decorators';

export class BaseConsultationReport {
   @IsString(false)
   consultationNote: string;

   @IsString(false)
   treatmentPlan: string;

   @IsString(true)
   symptoms?: string;
}
