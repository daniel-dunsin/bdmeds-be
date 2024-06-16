import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { availableDays } from 'src/api/doctor/interfaces';
import { UserDocument } from 'src/api/user/schema/user.schema';
import * as dateFns from 'date-fns';

@Injectable()
export class UtilService {
   constructor(private readonly configService: ConfigService) {}

   async hashPassword(password: string) {
      const saltFactor = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, saltFactor);

      return hashedPassword;
   }

   async comparePassword(password: string, hash: string) {
      return await bcrypt.compare(password, hash);
   }

   generateToken() {
      return crypto.randomBytes(32).toString('hex');
   }

   excludePassword(user: UserDocument) {
      delete user['_doc'].password;

      return user['_doc'];
   }

   setHourAndMin(hour: number, min: number) {
      const today = new Date();
      today.setHours(hour);
      today.setMinutes(min);
      return today;
   }

   checkDateConflicts(date: availableDays, dateRanges: availableDays[]) {
      let sessionSelected: availableDays | undefined;

      for (const availableDay of dateRanges) {
         if (availableDay.day === date.day) {
            const prevDate = {
               start: this.setHourAndMin(
                  availableDay.startTime.getHours(),
                  availableDay.startTime.getMinutes(),
               ),
               end: this.setHourAndMin(
                  availableDay.endTime.getHours(),
                  availableDay.endTime.getMinutes(),
               ),
            };

            const newDate = {
               start: this.setHourAndMin(
                  date.startTime.getHours(),
                  date.startTime.getMinutes(),
               ),
               end: this.setHourAndMin(
                  date.endTime.getHours(),
                  date.endTime.getMinutes(),
               ),
            };

            if (
               dateFns.isWithinInterval(newDate.start, prevDate) ||
               dateFns.isWithinInterval(newDate.end, prevDate)
            ) {
               sessionSelected = availableDay;
            }
            if (
               dateFns.isWithinInterval(prevDate.start, newDate) ||
               dateFns.isWithinInterval(prevDate.end, newDate)
            ) {
               sessionSelected = availableDay;
            }
         }
      }

      return sessionSelected;
   }
}
