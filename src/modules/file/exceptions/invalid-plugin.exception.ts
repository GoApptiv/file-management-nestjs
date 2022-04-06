import { BadRequestException } from '@nestjs/common';

export class InvalidPluginCodeException extends BadRequestException {
  constructor() {
    super({
      pluginCode: 'Plugin code is invalid',
    });
  }
}
