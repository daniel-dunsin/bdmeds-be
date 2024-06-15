import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient, PatientDocument } from './schema/patient.schema';
import { Model } from 'mongoose';

@Injectable()
export class PatientService {
   constructor(
      @InjectModel(Patient.name) _patientModel: Model<PatientDocument>,
   ) {}
}
