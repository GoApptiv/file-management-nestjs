class FileBo {
  name: string;
  size: number;
  type: string;
}

export class RegisterFileBO {
  templateCode: string;
  referenceNumber: string;
  projectId: number;
  file: FileBo;

  constructor(partial: Partial<RegisterFileBO> = {}) {
    Object.assign(this, partial);
  }
}
