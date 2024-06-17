import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BoneMetrics, BoneMetricsDocument } from './schemas/bone.schema';
import { Model } from 'mongoose';
import { BrainMetrics, BrainMetricsDocument } from './schemas/brain.schema';
import { EyesMetrics, EyesMetricsDocument } from './schemas/eyes.schema';
import { HeartMetrics, HeartMetricsDocument } from './schemas/heart.schema';
import { KidneyMetrics, KidneyMetricsDocument } from './schemas/kidney.schema';
import { LiverMetrics, LiverMetricsDocument } from './schemas/liver.schema';
import { SkinMetrics, SkinMetricsDocument } from './schemas/skin.schema';
import { TeethMetrics, TeethMetricsDocument } from './schemas/teeth.schema';
import { Departments } from '../doctor/enums';

@Injectable()
export class DiagnosisService {
   constructor(
      @InjectModel(BoneMetrics.name) private readonly _boneMetricsModel: Model<BoneMetricsDocument>,
      @InjectModel(BrainMetrics.name) private readonly _brainMetricsModel: Model<BrainMetricsDocument>,
      @InjectModel(EyesMetrics.name) private readonly _eyesMetricsModel: Model<EyesMetricsDocument>,
      @InjectModel(HeartMetrics.name) private readonly _heartMetricsModel: Model<HeartMetricsDocument>,
      @InjectModel(KidneyMetrics.name) private readonly _kidneyMetricsModel: Model<KidneyMetricsDocument>,
      @InjectModel(LiverMetrics.name) private readonly _liverMetricsModel: Model<LiverMetricsDocument>,
      @InjectModel(SkinMetrics.name) private readonly _skinMetricsModel: Model<SkinMetricsDocument>,
      @InjectModel(TeethMetrics.name) private readonly _teethMetricsModel: Model<TeethMetricsDocument>,
   ) {}

   private async mapDepartmentToModel(department: Departments) {
      const DEPTARTMENT_TO_MODEL: { [key in Departments]: Model<any> } = {
         [Departments.ORTHOPEDICS]: this._boneMetricsModel,
         [Departments.NEUROLOGY]: this._brainMetricsModel,
         [Departments.OPTOMETRY]: this._eyesMetricsModel,
         [Departments.CARDIOLOGY]: this._heartMetricsModel,
         [Departments.NEPHROLOGY]: this._kidneyMetricsModel,
         [Departments.HEPATOLOGY]: this._liverMetricsModel,
         [Departments.DERMATOLOGY]: this._skinMetricsModel,
         [Departments.DENTISTRY]: this._teethMetricsModel,
         [Departments.PSYCHOTHERAPY]: undefined,
      };

      const model = DEPTARTMENT_TO_MODEL[department];
      if (!model)
         throw new InternalServerErrorException('Unable to store records for the selected department');
   }
}
