import { FileStatus } from 'src/shared/constants/file-status.enum';

interface File {
  uuid: string;
  referenceNumber: string;
  status: FileStatus;
  storagePath: string;
  isUploaded: boolean;
  isArchived: boolean;
  fileSize: number;
  templateId: number;
  mimeTypeId: number;
  projectId: number;
  createdBy: number;
  archivalDate: Date;
}

export type StoreFileDAO = File;
