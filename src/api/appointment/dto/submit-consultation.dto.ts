import { ApiPreconditionFailedResponse, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, Max, Min, Validate, ValidateNested } from 'class-validator';
import { Frequency } from 'src/api/diagnosis/enums';
import { IsEnum, IsNumber, IsString } from 'src/shared/decorators';

export class PrescriptionsDto {
   @IsArray()
   medicines: string[];

   @IsString(false)
   prescriptionNote: string;
}

export class BaseConsultationReport {
   @IsString(false)
   consultationNote: string;

   @IsString(true)
   treatmentPlan?: string;

   @IsString(true)
   symptoms?: string;

   @ApiProperty()
   @ValidateNested()
   @Type(() => PrescriptionsDto)
   @IsOptional()
   prescription: PrescriptionsDto;

   diagnosis: string;
   diagnosisRef: string;
   appointment: string;
}

export class OrthopedicConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   boneHealthStatus: string;

   @IsNumber(false)
   rangeOfMotion: number;

   @IsNumber(false)
   totalFractures: number;
}

class CognitiveFunctionScore {
   @IsNumber(false)
   lower: number;

   @IsNumber(false)
   upper: number;
}
export class NuerologyConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   brainHealthStatus: string;

   @IsNumber(false)
   eegResults: string;

   @ApiProperty({ type: CognitiveFunctionScore })
   @ValidateNested()
   @Type(() => CognitiveFunctionScore)
   congnitiveFunctionTestScore: CognitiveFunctionScore;
}

export class OptometryConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   visionTestResult: string;

   @IsNumber(false)
   ocularPressure: number;

   @IsNumber(false)
   contactLensBaseCurve: number;

   @IsNumber(false)
   contactLensDiameter: number;
}

export class CardiologyConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   heartHealthStatus: string;

   @IsNumber(false)
   heartRate: number;

   @IsNumber(false)
   bloodPressureSystolic: number;

   @IsNumber(false)
   bloodPressureDiastolic: number;

   @IsNumber(false)
   bloodOxygenLevel: number;

   @IsNumber(false)
   cholestrolTotal: number;

   @IsNumber(false)
   cholestrolLDL: number;

   @IsNumber(false)
   cholestrolHDL: number;

   @IsNumber(false)
   ejectionFraction: number;

   @IsNumber(false)
   cardiacOutput: number;

   @IsNumber(false)
   bloodGlucoseLevel: number;
}

export class NephrologyConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   kidneyHealthStatus: string;

   @IsNumber(false)
   creatnine: number;

   @IsNumber(false)
   BUN: number;

   @IsNumber(false)
   urineProtein: number;

   @IsNumber(false)
   dialysisHours: number;

   @IsEnum(Frequency, false)
   dialysisFrequency: Frequency;
}

export class HepatologyConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   liverHealthStatus: string;

   @IsNumber(false)
   altLevel: number;

   @IsNumber(false)
   astLevel: number;

   @IsNumber(false)
   bilirubin: number;

   @IsNumber(false)
   fibrosisScore: number;
}

export class DermatologyConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   skinHealthStatus: string;

   @IsNumber(false)
   lesionCount: number;

   @IsNumber(false)
   lesionSize: number;

   @IsString(false)
   biopsyResults: string;
}

export class DentistryConsultationReportDto extends BaseConsultationReport {
   @IsString(false)
   dentalHealthStatus: string;

   @IsNumber(false)
   cavitiesCount: number;

   @IsNumber(false)
   gumRecession: number;

   @IsNumber(false)
   plaqueIndex: number;

   @IsString(true)
   recentProcedures?: string;
}
