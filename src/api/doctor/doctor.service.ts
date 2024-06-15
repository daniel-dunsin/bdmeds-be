import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './schema/doctor.schema';
import { Model } from 'mongoose';

@Injectable()
export class DoctorService {
   constructor(
      @InjectModel(Doctor.name) doctorService: Model<DoctorDocument>,
   ) {}
}
