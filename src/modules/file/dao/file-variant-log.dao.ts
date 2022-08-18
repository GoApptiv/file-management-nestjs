import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

interface FileVariantLog {
  variantId: number;
  pluginId: number;
  status: FileVariantStatus;
  messageId: string;
}

export type StoreFileVarianLogDAO = FileVariantLog;
