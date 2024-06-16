import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('diagnosis')
@ApiTags('diagnosis')
@ApiBearerAuth()
export class DiagnosisController {}
