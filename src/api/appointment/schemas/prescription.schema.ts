import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Medicine, MedicineDocument } from 'src/api/medicine/schemas/medicine.schema';
import { schemaOptions } from 'src/shared/constants/db.const';

@Schema(schemaOptions)
export class Prescription {
   @Prop({
      type: [
         {
            type: Types.ObjectId,
            ref: Medicine.name,
         },
      ],
   })
   medicines: Array<MedicineDocument | string>;

   @Prop({})
   prescriptionNote: string;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);
