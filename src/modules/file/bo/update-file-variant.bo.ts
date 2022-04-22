import { FileVariantCfStatus } from 'src/shared/constants/file-variant-cf-status.enum';

export class UpdateFileVariantBO {
  cfStatus: FileVariantCfStatus;
  filePath: string;
  fileName: string;
  messageId: string;

  constructor(partial: Partial<UpdateFileVariantBO> = {}) {
    Object.assign(this, partial);
  }
}
