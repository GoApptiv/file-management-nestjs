export class ReadFileBo {
  userId: number;
  uuid: string;
  ip: string;
  userAgent: string;

  constructor(partial: Partial<ReadFileBo> = {}) {
    Object.assign(this, partial);
  }
}
