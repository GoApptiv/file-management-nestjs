export interface FileVariantPubSubMessage {
  metadata: {
    uuid: string;
    variantId: number;
  };
  bucketConfig: {
    email: string;
    password: string;
  };
  path: {
    source: string;
    destination: string;
  };
}
