export interface FileVariantPubSubMessage {
  metadata: {
    uuid: string;
    variantId: number;
  };
  bucket: {
    source: {
      accessToken: string;
      path: string;
      file: string;
    };
    destination: {
      accessToken: string;
      path: string;
    };
  };
}
