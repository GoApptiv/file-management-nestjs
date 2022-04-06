import { BadRequestException } from '@nestjs/common';

export class DuplicateReferenceNumberException extends BadRequestException {
  constructor() {
    super({ referenceNumber: 'External reference id already exists' });
  }
}
