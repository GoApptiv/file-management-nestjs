export class ReadFileBo {
  uuid: string;
  ip: string;
  userAgent: string;

  constructor(partial: Partial<ReadFileBo> = {}) {
    Object.assign(this, partial);
  }
}
