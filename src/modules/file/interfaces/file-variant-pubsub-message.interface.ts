export interface FileVariantPubSubMessage {
  metadata: {
    uuid: string;
    variantId: number;
    projectId: number;
  };
  response: {
    topic: string;
  };
  bucket: {
    source: {
      bucketName: string;
      accessToken: string;
      path: string;
      file: string;
    };
    destination: {
      bucketName: string;
      accessToken: string;
      path: string;
    };
  };
}
