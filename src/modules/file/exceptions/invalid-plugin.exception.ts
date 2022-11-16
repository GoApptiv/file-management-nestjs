import { BadRequestException } from '@nestjs/common';

export class InvalidPluginException extends BadRequestException {
  constructor(message: string) {
    super({
      plugin: message,
    });
  }
}
