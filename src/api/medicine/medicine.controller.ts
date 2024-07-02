import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('medicine')
@ApiTags('medicine')
export class MedicineController {}
