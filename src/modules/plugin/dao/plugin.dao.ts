import { Status } from 'src/shared/constants/status.enum';

export class PluginDAO {
  id: number;
  name: string;
  code: string;
  cloudFunctionTopic: string;
  cloudFunctionResponseTopic: string;
  status: Status;

  constructor(partial: Partial<PluginDAO> = {}) {
    Object.assign(this, partial);
  }
}
