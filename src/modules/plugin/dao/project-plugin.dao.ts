import { Status } from 'src/shared/constants/status.enum';
import { ProjectPlugin } from '../entities/project-plugin.entity';

export class ProjectPluginDAO {
  projectId: number;
  pluginId: number;
  webhookUrl: string;
  pubsubStatusSubscriber: string;
  status: Status;

  constructor(partial: Partial<ProjectPlugin> = {}) {
    Object.assign(this, partial);
  }
}
