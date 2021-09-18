import { FileStatus } from 'src/shared/constants/file-status.enum';

export class FileDAO {
  id: number;
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

  constructor(partial: Partial<FileDAO> = {}) {
    Object.assign(this, partial);
  }
}
