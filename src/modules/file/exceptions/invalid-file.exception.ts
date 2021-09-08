import { BadRequestException } from '@nestjs/common';

export class InvalidFileException extends BadRequestException {
  constructor(message: string) {
    super({
      file: message,
    });
  }
}
