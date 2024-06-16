import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class AppointmentService {
   constructor(
      @InjectModel(Appointment.name)
      private readonly _appointmentModel: Model<AppointmentDocument>,
   ) {}

   async createAppointment<T>(createAppointmentDto: T) {
      const appointment =
         await this._appointmentModel.create(createAppointmentDto);

      return appointment;
   }

   async updateAppointment(
      filter: FilterQuery<AppointmentDocument>,
      update: UpdateQuery<AppointmentDocument>,
      options?: QueryOptions<AppointmentDocument>,
   ) {
      const appointment = await this._appointmentModel.findOneAndUpdate(
         filter,
         update,
         { new: true, runValidators: true, ...options },
      );

      return appointment;
   }

   async getAppointments(filter: FilterQuery<AppointmentDocument>) {
      const appointments = await this._appointmentModel.find(filter);

      return appointments;
   }

   async getAppointment(filter: FilterQuery<AppointmentDocument>) {
      const appointment = await this._appointmentModel.findOne(filter);

      return appointment;
   }

   async deleteAppointment(
      filter: FilterQuery<AppointmentDocument>,
      options?: QueryOptions<AppointmentDocument>,
   ) {
      const appointment = await this._appointmentModel.findOneAndDelete(
         filter,
         options,
      );

      return appointment;
   }
}
