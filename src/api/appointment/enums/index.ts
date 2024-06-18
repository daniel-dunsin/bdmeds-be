import { BoneMetrics } from 'src/api/diagnosis/schemas/bone.schema';
import { BrainMetrics } from 'src/api/diagnosis/schemas/brain.schema';
import { EyesMetrics } from 'src/api/diagnosis/schemas/eyes.schema';
import { HeartMetrics } from 'src/api/diagnosis/schemas/heart.schema';
import { KidneyMetrics } from 'src/api/diagnosis/schemas/kidney.schema';
import { LiverMetrics } from 'src/api/diagnosis/schemas/liver.schema';
import { SkinMetrics } from 'src/api/diagnosis/schemas/skin.schema';
import { TeethMetrics } from 'src/api/diagnosis/schemas/teeth.schema';

export enum AppointmentStatus {
   PENDING = 'pending',
   SUCCESSFUL = 'successful',
   FAILED = 'failed',
   CANCELLED = 'cancelled',
}

export enum AppointmentMode {
   ONLINE = 'online',
   PHYSICAL = 'physical',
}

export const DiagnosisRef = {
   BONE_METRICS: BoneMetrics.name,
   BRAIN_METRICS: BrainMetrics.name,
   EYES_METRICS: EyesMetrics.name,
   HEART_METRICS: HeartMetrics.name,
   KIDNEY_METRICS: KidneyMetrics.name,
   LIVER_METRICS: LiverMetrics.name,
   SKIN_METRICS: SkinMetrics.name,
   TEETH_METRICS: TeethMetrics.name,
};
