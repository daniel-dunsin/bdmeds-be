import { BoneMetricsDocument } from 'src/api/diagnosis/schemas/bone.schema';
import { BrainMetricsDocument } from 'src/api/diagnosis/schemas/brain.schema';
import { EyesMetricsDocument } from 'src/api/diagnosis/schemas/eyes.schema';
import { HeartMetricsDocument } from 'src/api/diagnosis/schemas/heart.schema';
import { KidneyMetricsDocument } from 'src/api/diagnosis/schemas/kidney.schema';
import { LiverMetricsDocument } from 'src/api/diagnosis/schemas/liver.schema';
import { SkinMetricsDocument } from 'src/api/diagnosis/schemas/skin.schema';
import { TeethMetricsDocument } from 'src/api/diagnosis/schemas/teeth.schema';

export type DiagnosisDocument =
   | BoneMetricsDocument
   | BrainMetricsDocument
   | EyesMetricsDocument
   | HeartMetricsDocument
   | KidneyMetricsDocument
   | LiverMetricsDocument
   | SkinMetricsDocument
   | TeethMetricsDocument;
