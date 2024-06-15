import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schema/patient.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';

@Injectable()
export class PatientService {
   constructor(
      @InjectModel(Patient.name)
      private readonly _patientModel: Model<PatientDocument>,
   ) {}

   async createPatient<T>(data: T) {
      const patient = await this._patientModel.create(data);

      return patient;
   }

   async getPatient(filter: FilterQuery<PatientDocument>) {
      const patient = await this._patientModel.findOne(filter);

      return patient;
   }

   async getPatients(filter: FilterQuery<PatientDocument>) {
      const patients = await this._patientModel.find(filter);

      return patients;
   }

   async updatePatient(
      filter: FilterQuery<PatientDocument>,
      update: UpdateQuery<PatientDocument>,
   ) {
      const patient = await this._patientModel.findOneAndUpdate(filter);

      return patient;
   }

   async deletePatient(filter: FilterQuery<PatientDocument>) {
      const patient = await this._patientModel.findOneAndDelete(filter);

      return patient;
   }
}
