import { FileVariantCfStatus } from 'src/shared/constants/file-variant-cf-status.enum';

export interface CfFileVariantResponseMessage {
  message: {
    uuid: string;
    variantId: number;
    filePath: string;
    fileName: string;
    status: FileVariantCfStatus;
  };
}
