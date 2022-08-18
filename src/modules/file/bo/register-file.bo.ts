class FileBo {
  name: string;
  size: number;
  type: string;
}

export interface RegisterFileBO {
  templateCode: string;
  referenceNumber: string;
  projectId: number;
  file: FileBo;
}
