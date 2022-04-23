export class ReadFileBO {
  uuid: string;
  ip: string;
  userAgent: string;

  constructor(partial: Partial<ReadFileBO> = {}) {
    Object.assign(this, partial);
  }
}
