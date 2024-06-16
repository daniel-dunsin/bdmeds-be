import {
   BadRequestException,
   ForbiddenException,
   Injectable,
   NotFoundException,
   UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jwt, JwtDocument } from './schema/jwt.schema';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import {
   OnBoardDoctorDto,
   OnBoardPatientDto,
   RegisterDto,
} from './dto/register.dto';
import { UtilService } from 'src/shared/services/utils.service';
import { TokenService } from '../token/token.service';
import * as crypto from 'crypto';
import { TokenTypes } from '../token/enums';
import { MailService } from 'src/shared/mail/mail.service';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserDocument } from '../user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtType } from './enums/jwt.enum';
import { RoleNames } from '../user/enums';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(Jwt.name) private readonly _jwtModel: Model<JwtDocument>,
      private readonly userService: UserService,
      private readonly utilService: UtilService,
      private readonly tokenService: TokenService,
      private readonly mailService: MailService,
      private readonly configService: ConfigService,
      private readonly jwtService: JwtService,
      private readonly doctorService: DoctorService,
      private readonly patientService: PatientService,
   ) {}

   private async auth(user: UserDocument) {
      const ONE_HOUR = 1000 * 60 * 60;
      const accessToken = await this.jwtService.signAsync(user, {
         expiresIn: '1h',
      });
      const refreshToken = await this.jwtService.signAsync(user, {
         expiresIn: '7d',
      });

      await this._jwtModel.updateOne(
         { user: user._id, type: JwtType.access },
         { token: accessToken },
         { upsert: true },
      );
      await this._jwtModel.updateOne(
         { user: user._id, type: JwtType.refresh },
         { token: refreshToken },
         { upsert: true },
      );

      return {
         user,
         meta: {
            accessToken,
            refreshToken,
            lifeSpan: ONE_HOUR,
         },
      };
   }

   async signUp(signUpDto: RegisterDto): Promise<UserDocument> {
      const userExists = await this.userService.getUser({
         $or: [
            {
               email: signUpDto.email,
            },
            { phoneNumber: signUpDto.phoneNumber },
         ],
      });

      if (userExists) {
         throw new BadRequestException(
            'Oops! A user with this email or phone number already exists',
         );
      }

      signUpDto.password = await this.utilService.hashPassword(
         signUpDto.password,
      );

      const user = await this.userService.createUser(signUpDto);

      const token = await this.tokenService.findOrCreateToken({
         email: user.email,
         value: this.utilService.generateToken(),
         type: TokenTypes.accountVerification,
      });

      const link = `${this.configService.get('FRONTEND_URL')}/account/verify?email=${token.email}&token=${token.value}`;

      await this.mailService.sendMail({
         to: user.email,
         subject: 'BdMeds: Account Verification',
         template: 'account-verification',
         context: {
            firstName: user.firstName,
            link,
         },
      });

      return user;
   }

   async onBoardPatient(onBoardPatientDto: OnBoardPatientDto) {
      onBoardPatientDto.role = RoleNames.PATIENT;
      const user = await this.signUp(onBoardPatientDto);

      await this.patientService.createPatient({ user: user._id });

      return {
         success: true,
         message: 'Verification email sent 🪁',
      };
   }

   async onBoardDoctor(onBoardDoctorDto: OnBoardDoctorDto) {
      onBoardDoctorDto.role = RoleNames.DOCTOR;
      const user = await this.signUp(onBoardDoctorDto);

      await this.doctorService.createDoctor({
         yearsOfExperience: onBoardDoctorDto.yearsOfExperience,
         speciality: onBoardDoctorDto.speciality,
         user: user._id,
      });

      return {
         success: true,
         message: 'Verification email sent 🪁',
      };
   }

   async verifyEmail(verifyEmailDto: VerifyEmailDto) {
      const token = await this.tokenService.getToken({
         email: verifyEmailDto.email,
         value: verifyEmailDto.token,
         type: TokenTypes.accountVerification,
      });

      if (!token)
         throw new NotFoundException(
            'Token is invalid, try to login to receive a new verification link',
         );

      await this.userService.updateUser(
         { email: token.email },
         { emailVerified: true },
      );
      await token.deleteOne();

      return {
         success: true,
         message: 'Account Verified 😉',
      };
   }

   async requestEmailVerificationLink(email: string) {
      const user = await this.userService.getUser({ email });

      if (!user)
         throw new NotFoundException("User with this email doesn't exist");
      if (user.emailVerified)
         throw new NotFoundException('This account is already verified');

      const token = await this.tokenService.findOrCreateToken({
         email: user.email,
         value: this.utilService.generateToken(),
         type: TokenTypes.accountVerification,
      });

      const link = `${this.configService.get('FRONTEND_URL')}/account/verify?email=${token.email}&token=${token.value}`;

      await this.mailService.sendMail({
         to: user.email,
         subject: 'BdMeds: Account Verification',
         template: 'account-verification',
         context: {
            firstName: user.firstName,
            link,
         },
      });

      return {
         success: true,
         message: 'Verficiation Email Sent 🪁',
      };
   }

   async forgotPassword(email: string) {
      const user = await this.userService.getUser({ email });

      if (user) {
         const token = await this.tokenService.findOrCreateToken({
            email,
            type: TokenTypes.passwordReset,
            value: this.utilService.generateToken(),
         });

         const link = `${this.configService.get('FRONTEND_URL')}/reset-password?email=${token.email}&token=${token.value}`;

         await this.mailService.sendMail({
            to: user.email,
            subject: 'BdMeds: Password Reset Request',
            template: 'forgot-password',
            context: {
               firstName: user.firstName,
               link,
            },
         });
      }

      return {
         success: true,
         message: 'password reset link sent successfully',
      };
   }

   async resetPassword(resetPasswordDto: ResetPasswordDto) {
      const token = await this.tokenService.getToken({
         type: TokenTypes.passwordReset,
         value: resetPasswordDto.token,
         email: resetPasswordDto.email,
      });

      if (!token)
         throw new NotFoundException(
            'password reset link is invalid or has expired',
         );

      const hashedPassword = await this.utilService.hashPassword(
         resetPasswordDto.password,
      );

      await this.userService.updateUser(
         { email: token.email },
         { password: hashedPassword },
      );
      await token.deleteOne();

      return {
         success: true,
         message: 'password reset successful',
      };
   }

   async signIn(signInDto: SignInDto) {
      let user: UserDocument;

      if (signInDto.email) {
         user = await this.userService.getUser({ email: signInDto.email });
      } else if (signInDto.phoneNumber) {
         user = await this.userService.getUser({
            phoneNumber: signInDto.phoneNumber,
         });
      }

      if (!user) throw new UnauthorizedException('Invalid login credentials');

      const passwordMatch: boolean = await this.utilService.comparePassword(
         signInDto.password,
         user.password,
      );
      if (!passwordMatch)
         throw new UnauthorizedException('Invalid login credentials');

      const data = await this.auth(this.utilService.excludePassword(user));

      return {
         success: true,
         message: 'sign in successful',
         data,
      };
   }

   async refreshSession(refreshToken: string) {
      const verifiedToken = await this.jwtService.verifyAsync(refreshToken);
      if (!verifiedToken) {
         throw new ForbiddenException('your session is invalid or has expired');
      }
      const jwtToken = await this._jwtModel.findOne({
         type: JwtType.refresh,
         token: refreshToken,
      });

      if (!jwtToken) {
         throw new ForbiddenException('your session is invalid or has expired');
      }

      const user = await this.userService.getUser({ _id: jwtToken.user });

      const accessToken = await this.jwtService.signAsync(
         this.utilService.excludePassword(user),
      );
      await this._jwtModel.updateOne(
         {
            type: JwtType.access,
            user: jwtToken.user,
         },
         { token: accessToken },
         { upsert: true },
      );

      return {
         success: true,
         message: 'session refreshed successfully',
         data: {
            accessToken,
            refreshToken,
         },
      };
   }

   async changePassword(changePasswordDto: ChangePasswordDto, userId: string) {
      const user = await this.userService.getUser({ _id: userId });

      const passwordMatch = await this.utilService.comparePassword(
         changePasswordDto.oldPassword,
         user.password,
      );

      if (!passwordMatch)
         throw new BadRequestException('Old password is incorrect');

      const hashedPassword = await this.utilService.hashPassword(
         changePasswordDto.newPassword,
      );
      user.password = hashedPassword;
      await user.save();

      return {
         success: true,
         message: 'password changed',
      };
   }
}
