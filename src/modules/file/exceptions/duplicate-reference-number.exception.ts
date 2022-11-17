import { GaConflictException } from '@goapptiv/exception-handler-nestjs';
import { FileErrorCode } from '../constants/errors.enum';

export class DuplicateReferenceNumberException extends GaConflictException {
  constructor(referenceNumber: string) {
    super([
      {
        type: FileErrorCode.E409_FILE_DUPLICATE_REFERENCE_NUMBER,
        message: 'Duplicate reference number',
        context: { referenceNumber },
      },
    ]);
  }
}
