interface credentials {
  email: string;
  privateKey: string;
}

export interface GcpCredentialsOptions {
  projectId: string;
  pubSub: credentials;
}
