import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('/signup')
   async signUp(@Body() signUpDto: RegisterDto) {
      const data = await this.authService.signUp(signUpDto);

      return data;
   }

   @Post('/verify-email')
   @HttpCode(HttpStatus.OK)
   async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
      const data = await this.authService.verifyEmail(verifyEmailDto);

      return data;
   }

   @Post('/verify-email/request')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'resend verification email' })
   @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
   async requestVerificationEmail(@Body('email') email: string) {
      const data = await this.authService.requestEmailVerificationLink(email);

      return data;
   }

   @Post('/forgot-password')
   @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'resend password reset link' })
   @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
   async forgotPassword(@Body('email') email: string) {
      const data = await this.authService.forgotPassword(email);

      return data;
   }

   @Post('/reset-password')
   @HttpCode(HttpStatus.OK)
   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      const data = await this.authService.resetPassword(resetPasswordDto);

      return data;
   }

   @Post('/signin')
   @HttpCode(HttpStatus.OK)
   async signIn(@Body() signInDto: SignInDto) {
      const data = await this.authService.signIn(signInDto);

      return data;
   }
}
