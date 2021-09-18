export class FileAccessedEvent {
  userId: number;
  fileId: number;
  projectId: number;
  ip: string;
  userAgent: string;
  isArchived: boolean;
}
