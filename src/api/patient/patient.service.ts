import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schema/patient.schema';
import { FilterQuery, Model, Query, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class PatientService {
   constructor(
      @InjectModel(Patient.name)
      private readonly _patientModel: Model<PatientDocument>,
   ) {}

   async populate(model: Query<any, PatientDocument>) {
      return await model.populate([
         { path: 'user' },
         { path: 'favouriteDoctors', populate: [{ path: 'user' }] },
      ]);
   }

   async createPatient<T>(data: T) {
      const patient = await this._patientModel.create(data);

      return patient;
   }

   async getPatient(filter: FilterQuery<PatientDocument>) {
      const patient = await this.populate(this._patientModel.findOne(filter));

      return patient;
   }

   async getPatients(filter: FilterQuery<PatientDocument>) {
      const patients = await this.populate(this._patientModel.find(filter));

      return patients;
   }

   async updatePatient(
      filter: FilterQuery<PatientDocument>,
      update: UpdateQuery<PatientDocument>,
      options?: QueryOptions<PatientDocument>,
   ) {
      const patient = await this.populate(
         this._patientModel.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
            ...options,
         }),
      );

      return patient;
   }

   async deletePatient(filter: FilterQuery<PatientDocument>) {
      const patient = await this._patientModel.findOneAndDelete(filter);

      return patient;
   }
}
