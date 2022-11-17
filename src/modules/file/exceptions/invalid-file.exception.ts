import { GaNotFoundException } from '@goapptiv/exception-handler-nestjs';
import { FileErrorCode } from '../constants/errors.enum';

export class InvalidFileException extends GaNotFoundException {
  constructor(uuid: string) {
    super([
      {
        type: FileErrorCode.E404_FILE,
        message: 'Invalid file',
        context: {
          uuid,
        },
      },
    ]);
  }
}
