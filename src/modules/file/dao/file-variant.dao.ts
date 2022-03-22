import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

export class FileVariantDAO {
  id: number;
  fileId: number;
  pluginId: number;
  storagePath: string;
  status: FileVariantStatus;

  constructor(partial: Partial<FileVariantDAO> = {}) {
    Object.assign(this, partial);
  }
}
