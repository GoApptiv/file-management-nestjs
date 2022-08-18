import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

export class FileVariant {
  fileId: number;
  pluginId: number;
  storagePath?: string;
  status: FileVariantStatus;
}

export type StoreFileVariantDAO = FileVariant;
