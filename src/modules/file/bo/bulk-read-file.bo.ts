export class BulkReadFileBo {
  uuids: [];
  ip: string;
  userAgent: string;

  constructor(partial: Partial<BulkReadFileBo> = {}) {
    Object.assign(this, partial);
  }
}
