import {
  Bucket,
  GetSignedUrlConfig,
  SetStorageClassResponse,
  Storage,
} from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { BucketType } from '../constants/bucket-type.enum';

@Injectable()
export class CloudStorageService {
  private bucket: Bucket;
  private storage: Storage;

  /**
   *
   * @param email - The email id of the Google Cloud Service account.
   * @param privateKey - The private key of the service account.
   * @param bucket - Name of the bucket.
   */
  constructor(email: string, privateKey: string, bucket: string) {
    this.storage = new Storage({
      credentials: {
        private_key: privateKey,
        client_email: email,
      },
    });
    this.bucket = this.storage.bucket(bucket);
  }

  /**
   * generate upload signed url
   */
  async generateUploadSignedUrl(
    path: string,
    contentType: string,
    expiryTime?: moment.Moment,
  ): Promise<string> {
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: expiryTime.toDate(),
      contentType,
    };

    // Get a v4 signed URL for uploading file
    const [url] = await this.bucket.file(path).getSignedUrl(options);

    return url;
  }

  /**
   * generate read signed url
   */
  async generateReadSignedUrl(
    path: string,
    expiryTime?: moment.Moment,
  ): Promise<string> {
    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: expiryTime.toDate(),
    };

    // Get a v4 signed URL for uploading file
    const [url] = await this.bucket.file(path).getSignedUrl(options);

    return url;
  }

  /**
   * sets the storage class to archive which is of minimum duration 365 days
   */
  async setStorageClassToArchive(
    file: string,
  ): Promise<SetStorageClassResponse> {
    return await this.bucket.file(file).setStorageClass(BucketType.ARCHIVE);
  }

  /**
   * sets the directory storage class to archive which is of minimum duration 365 days
   */
  async setDirectoryStorageClassToArchive(directory: string): Promise<void> {
    const filePages = await this.bucket.getFiles({ directory });
    filePages.forEach((files) =>
      files.forEach((file) =>
        this.bucket.file(file.name).setStorageClass(BucketType.ARCHIVE),
      ),
    );
  }

  /**
   * sets the storage class to standard
   */
  async setStorageClassToStandard(
    file: string,
  ): Promise<SetStorageClassResponse> {
    return await this.bucket.file(file).setStorageClass(BucketType.STANDARD);
  }

  /**
   * sets the directory storage class to standard
   */
  async setDirectoryStorageClassToStandard(directory: string): Promise<void> {
    const filePages = await this.bucket.getFiles({ directory });
    filePages.forEach((files) =>
      files.forEach((file) =>
        this.bucket.file(file.name).setStorageClass(BucketType.STANDARD),
      ),
    );
  }
}
