export class BulkReadFileBo {
  uuids: [];
  userId: number;
  ip: string;
  userAgent: string;

  constructor(partial: Partial<BulkReadFileBo> = {}) {
    Object.assign(this, partial);
  }
}
