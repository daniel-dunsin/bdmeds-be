import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
   OnBoardAdminDto,
   OnBoardDoctorDto,
   OnBoardPatientDto,
   RegisterDto,
} from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth, IsPublic } from 'src/shared/decorators/auth.decorators';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('/signup/patient')
   @IsPublic()
   async onBoardPatient(@Body() onBoardPatientDto: OnBoardPatientDto) {
      const data = await this.authService.onBoardPatient(onBoardPatientDto);

      return data;
   }

   @Post('/signup/doctor')
   @IsPublic()
   async onBoardDoctor(@Body() onBoardDoctorDto: OnBoardDoctorDto) {
      const data = await this.authService.onBoardDoctor(onBoardDoctorDto);

      return data;
   }

   @Post('/signup/admin')
   @IsPublic()
   async onBoardAdmin(@Body() onBoardAdminDto: OnBoardAdminDto) {
      const data = await this.authService.onBoardAdmin(onBoardAdminDto);

      return data;
   }

   @Post('/verify-email')
   @IsPublic()
   @HttpCode(HttpStatus.OK)
   async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
      const data = await this.authService.verifyEmail(verifyEmailDto);

      return data;
   }

   @Post('/verify-email/request')
   @IsPublic()
   @HttpCode(HttpStatus.OK)
   @ApiBody({
      schema: { type: 'object', properties: { email: { type: 'string' } } },
   })
   async requestVerificationEmail(@Body('email') email: string) {
      const data = await this.authService.requestEmailVerificationLink(email);

      return data;
   }

   @Post('/forgot-password')
   @IsPublic()
   @HttpCode(HttpStatus.OK)
   @ApiBody({
      schema: { type: 'object', properties: { email: { type: 'string' } } },
   })
   async forgotPassword(@Body('email') email: string) {
      const data = await this.authService.forgotPassword(email);

      return data;
   }

   @Post('/reset-password')
   @HttpCode(HttpStatus.OK)
   @IsPublic()
   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      const data = await this.authService.resetPassword(resetPasswordDto);

      return data;
   }

   @Post('/signin')
   @IsPublic()
   @HttpCode(HttpStatus.OK)
   async signIn(@Body() signInDto: SignInDto) {
      const data = await this.authService.signIn(signInDto);

      return data;
   }

   @Post('/session/refresh')
   @IsPublic()
   @HttpCode(HttpStatus.OK)
   @ApiBody({
      schema: {
         type: 'object',
         properties: { refreshToken: { type: 'string' } },
      },
   })
   async refreshSesson(@Body('refreshToken') refreshToken: string) {
      const data = await this.authService.refreshSession(refreshToken);

      return data;
   }

   @Put('/change-password')
   @ApiBearerAuth()
   @HttpCode(HttpStatus.OK)
   async changePassword(
      @Auth('_id') userId: string,
      @Body() changePasswordDto: ChangePasswordDto,
   ) {
      const data = await this.authService.changePassword(
         changePasswordDto,
         userId,
      );

      return data;
   }
}
