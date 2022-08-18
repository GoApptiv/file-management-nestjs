import { Status } from 'src/shared/constants/status.enum';

interface ProjectPlugin {
  projectId: number;
  pluginId: number;
  webhookUrl: string;
  pubsubStatusSubscriber: string;
  status: Status;
}

export type StoreProjectPluginDAO = ProjectPlugin;
