import { GaNotFoundException } from '@goapptiv/exception-handler-nestjs';
import { FileTemplateErrorCode } from '../constants/errors.enum';

export class InvalidTemplateException extends GaNotFoundException {
  constructor(templateCode: string) {
    super([
      {
        type: FileTemplateErrorCode.E404_FILE_TEMPLATE,
        message: 'Invalid template code',
        context: {
          templateCode,
        },
      },
    ]);
  }
}
