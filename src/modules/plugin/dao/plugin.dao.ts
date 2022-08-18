import { Status } from 'src/shared/constants/status.enum';

interface Plugin {
  id: number;
  name: string;
  code: string;
  cloudFunctionTopic: string;
  cloudFunctionResponseTopic: string;
  status: Status;
}

export type StorePluginDAO = Plugin;

export type FilterPluginDAO = Pick<Plugin, 'status'>;
