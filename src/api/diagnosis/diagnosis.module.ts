import { Module } from '@nestjs/common';
import { DiagnosisProvider } from './diagnosis.provider';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisController } from './diagnosis.controller';

@Module({
   providers: [DiagnosisProvider, DiagnosisService],
   controllers: [DiagnosisController],
})
export class DiagnosisModule {}
