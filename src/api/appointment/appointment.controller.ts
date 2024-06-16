import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { UserDocument } from '../user/schema/user.schema';
import { BookSessionDto } from './dto/book-appointment.dto';
import { AppointmentProvider } from './appointment.provider';

@Controller('appointment')
@ApiTags('appointment')
@ApiBearerAuth()
export class AppointmentController {
   constructor(private readonly appointmentProvider: AppointmentProvider) {}

   @Post('/:doctorId/book')
   async bookSession(
      @Auth() user: UserDocument,
      @Param('doctorId') doctorId: string,
      @Body() bookSessionDto: BookSessionDto,
   ) {
      const data = await this.appointmentProvider.bookSession(bookSessionDto, doctorId, user);

      return data;
   }
}
