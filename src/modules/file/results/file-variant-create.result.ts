import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';

export interface FileVariantCreateResult {
  variantId: number;
  pluginCode: string;
  status: FileVariantStatus;
}
