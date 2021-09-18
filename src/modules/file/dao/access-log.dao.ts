export class AccessLogDAO {
  userId: number;
  fileId: number;
  projectId: number;
  ip: string;
  userAgent: string;
  isArchived: boolean;

  constructor(partial: Partial<AccessLogDAO> = {}) {
    Object.assign(this, partial);
  }
}
