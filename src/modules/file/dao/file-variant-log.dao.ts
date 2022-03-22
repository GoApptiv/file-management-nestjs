import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

export class FileVariantLogDAO {
  id: number;
  variantId: number;
  pluginId: number;
  status: FileVariantStatus;
  creationTopicMessageId: string;

  constructor(partial: Partial<FileVariantLogDAO> = {}) {
    Object.assign(this, partial);
  }
}
