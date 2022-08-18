interface AccessLog {
  fileId: number;
  projectId: number;
  ip: string;
  userAgent: string;
  isArchived: boolean;
}

export type StoreAccessLogDAO = AccessLog;
