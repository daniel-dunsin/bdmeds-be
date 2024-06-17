import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('consultation')
@ApiTags('consultation')
@ApiBearerAuth()
export class ConsultationController {}
