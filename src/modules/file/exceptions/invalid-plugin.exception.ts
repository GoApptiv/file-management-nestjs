import { GaNotFoundException } from '@goapptiv/exception-handler-nestjs';
import { PluginErrorCode } from '../constants/errors.enum';

export class InvalidPluginException extends GaNotFoundException {
  constructor(pluginCode: string) {
    super([
      {
        type: PluginErrorCode.E404_PLUGIN,
        message: 'Invalid plugin code',
        context: {
          pluginCode,
        },
      },
    ]);
  }
}
