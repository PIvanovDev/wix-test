import { ArgumentMetadata, BadRequestException, Paramtype, PipeTransform } from '@nestjs/common';
import { Schema } from 'joi';

export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Record<Paramtype, Schema>) {}

  transform(input: any, metadata: ArgumentMetadata) {
    const { error, value } = this.schema[metadata.type].validate(input);
    if (error) {
      console.error(error.details);
      throw new BadRequestException(error.message);
    }
    return value;
  }
}
