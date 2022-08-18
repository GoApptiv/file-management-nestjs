import { FileVariantCfStatus } from 'src/shared/constants/file-variant-cf-status.enum';

export interface UpdateFileVariantBO {
  cfStatus: FileVariantCfStatus;
  filePath: string;
  fileName: string;
  messageId: string;
}
