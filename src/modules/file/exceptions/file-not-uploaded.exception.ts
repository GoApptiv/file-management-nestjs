import { GaConflictException } from '@goapptiv/exception-handler-nestjs';
import { FileErrorCode } from '../constants/errors.enum';

export class FileNotUploadedException extends GaConflictException {
  constructor(uuid: string) {
    super([
      {
        type: FileErrorCode.E404_FILE_UPLOAD_NOT_FOUND,
        message:
          'File upload not found in the bucket, cannot confirm file uploaded.',
        context: { uuid },
      },
    ]);
  }
}
