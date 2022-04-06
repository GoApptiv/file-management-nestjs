import { BadRequestException } from '@nestjs/common';

export class InvalidTemplateException extends BadRequestException {
  constructor() {
    super({ referenceNumber: 'Template does not exists' });
  }
}
