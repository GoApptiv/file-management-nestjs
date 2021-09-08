import { BadRequestException } from '@nestjs/common';

export class DuplicateReferenceNumberException extends BadRequestException {
  constructor() {
    super({ reference_number: 'External reference id already exists' });
  }
}
