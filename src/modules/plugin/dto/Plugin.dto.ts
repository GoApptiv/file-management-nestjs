import { Status } from 'src/shared/constants/status.enum';

export class PluginDAO {
  name: string;
  code: string;
  cloudFunctionUrl: string;
  status: Status;

  constructor(partial: Partial<PluginDAO> = {}) {
    Object.assign(this, partial);
  }
}
