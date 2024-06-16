import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('appointment')
@ApiTags('appointment')
@ApiBearerAuth()
export class AppointmentController {}
