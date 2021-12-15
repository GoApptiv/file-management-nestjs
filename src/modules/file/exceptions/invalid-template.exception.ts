import { BadRequestException } from '@nestjs/common';

export class InvalidTemplateException extends BadRequestException {
  constructor() {
    super({ reference_number: 'Template does not exists' });
  }
}
