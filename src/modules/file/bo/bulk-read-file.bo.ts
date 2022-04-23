export class BulkReadFileBO {
  uuids: [];
  ip: string;
  userAgent: string;

  constructor(partial: Partial<BulkReadFileBO> = {}) {
    Object.assign(this, partial);
  }
}
