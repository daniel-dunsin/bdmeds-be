import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export class MongoIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const isValid = Types.ObjectId.isValid(value);

    if (!isValid) {
      throw new BadRequestException('invalid mongo id');
    }

    return value;
  }
}
