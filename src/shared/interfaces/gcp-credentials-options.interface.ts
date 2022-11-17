interface Credentials {
  email: string;
  privateKey: string;
}

export interface GcpCredentialsOptions {
  projectId: string;
  logName: string;
  pubSub: Credentials;
  logging: Credentials;
}
