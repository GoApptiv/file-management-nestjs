import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FileRepository } from '../repositories/file.repository';
import { TemplateRepository } from '../repositories/template.repository';
import { File } from '../entities/file.entity';
import { FileStatus } from 'src/shared/constants/file-status.enum';
import { MimeTypeRepository } from '../repositories/mime-type.repository';
import { CloudStorageService } from 'src/shared/services/cloud-storage.service';
import { ReadSignedUrlResult } from '../results/read-signed-url.result';
import { ConfirmUploadResult } from '../results/confirm-upload.result';
import { WriteSignedUrlResult } from '../results/write-signed-url.result';
import { BucketConfigRepository } from 'src/modules/auth/repositories/bucket-config.repository';
import { BucketType } from 'src/shared/constants/bucket-type';
import { UtilsService } from 'src/shared/services/utils.service';
import { DuplicateReferenceNumberException } from '../exceptions/duplicate-reference-number.exception';
import { InvalidFileException } from '../exceptions/invalid-file.exception';
import { RegisterFileBO } from '../bo/register-file.bo';
import { FileDAO } from '../dao/file.dao';
import { EventEmitter2 } from 'eventemitter2';
import { ReadFileBo } from '../bo/read-file.bo';
import { FileAccessedEvent } from '../events/file-accessed.event';

@Injectable()
export class FileService {
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly templateRepository: TemplateRepository,
    private readonly fileRepository: FileRepository,
    private readonly mimeTypeRepository: MimeTypeRepository,
    private readonly bucketConfigRepository: BucketConfigRepository,
  ) {}

  /**
   * generate signed url
   * @param data - Register file request
   * @returns signed url and uuid
   */
  async getUploadSignedUrl(
    data: RegisterFileBO,
  ): Promise<WriteSignedUrlResult> {
    const template = await this.templateRepository.findByCode(
      data.templateCode,
    );

    const uuid = this.generateUuid(data.referenceNumber, data.projectId);
    const templateForUuId = await this.fileRepository.findByUuid(uuid);

    if (templateForUuId !== undefined) {
      throw new DuplicateReferenceNumberException();
    }

    if (
      this.isFileValidForTemplate(
        data.templateCode,
        data.file.size,
        data.file.type,
      )
    ) {
      const storagePath = this.generateStoragePath(
        template.baseStoragePath,
        data.file.name,
        data.referenceNumber,
      );

      const expiryTime = this.generateExpiryTime(template.linkExpiryTime);

      const bucketConfig =
        await this.bucketConfigRepository.findByProjectIdAndType(
          data.projectId,
          BucketType.STANDARD,
        );

      const storage = new CloudStorageService(
        bucketConfig.email,
        UtilsService.base64decodeKey(bucketConfig.key),
        bucketConfig.name,
      );

      const signedUrl = await storage.generateUploadSignedUrl(
        storagePath,
        data.file.type,
        expiryTime,
      );

      const store = await this.storeFileUploadRequest(
        data,
        uuid,
        storagePath,
        template.id,
      );

      return {
        uuid: store.uuid,
        url: signedUrl,
        reference_number: store.referenceNumber,
      };
    }
  }

  /**
   * confirm upload
   * @param uuid - uuid of the file
   * @returns update result
   */
  async confirmUpload(uuid: string): Promise<ConfirmUploadResult> {
    const updateResult = await this.fileRepository.updateByUuid(
      uuid,
      new FileDAO({
        isUploaded: true,
        status: FileStatus.UPLOADED,
      }),
    );
    return {
      uuid,
      result: updateResult,
    };
  }

  /**
   * generate read signed url
   * @param uuid - hash id of the file
   * @returns read access signed url
   */
  async getReadSignedUrl(data: ReadFileBo): Promise<ReadSignedUrlResult> {
    const file = await this.fileRepository.findByUuid(data.uuid, ['template']);

    let bucketType = BucketType.STANDARD;

    if (file.isArchieved) {
      bucketType = BucketType.ARCHIVE;
    }

    const expiryTime = this.generateExpiryTime(file.template.linkExpiryTime);

    const bucketConfig =
      await this.bucketConfigRepository.findByProjectIdAndType(
        file.projectId,
        bucketType,
      );

    const storage = new CloudStorageService(
      bucketConfig.email,
      UtilsService.base64decodeKey(bucketConfig.key),
      bucketConfig.name,
    );

    const signedUrl = await storage.generateReadSignedUrl(
      file.storagePath,
      expiryTime,
    );

    const fileAccessEvent = new FileAccessedEvent();
    fileAccessEvent.userId = data.userId;
    fileAccessEvent.fileId = file.id;
    fileAccessEvent.ip = data.ip;
    fileAccessEvent.projectId = file.projectId;
    fileAccessEvent.userAgent = data.userAgent;

    this.eventEmitter.emit('file.accessed', fileAccessEvent);

    return { uuid: data.uuid, url: signedUrl };
  }

  /**
   * Store file request in the database
   * @param dto - register file request
   * @param projectId - id of the project
   * @param uuid - generated uuid
   * @param storagePath - storage path
   * @param templateId - template id
   * @returns stored record data
   */
  private async storeFileUploadRequest(
    data: RegisterFileBO,
    uuid: string,
    storagePath: string,
    templateId: number,
  ): Promise<File> {
    const mimeType = await this.mimeTypeRepository.findByType(data.file.type);

    const file = new FileDAO();
    file.fileSize = data.file.size;
    file.uuid = uuid;
    file.isArchieved = false;
    file.isUploaded = false;
    file.status = FileStatus.REQUESTED;
    file.storagePath = storagePath;
    file.referenceNumber = data.referenceNumber;
    file.projectId = data.projectId;
    file.mimeTypeId = mimeType.id;
    file.templateId = templateId;

    return this.fileRepository.store(file);
  }

  /**
   * validate file to be uploaded
   * @param templateCode - Template code of the file
   * @param fileSize - Size of the file to be uploaded
   * @param fileType - MimeType of the file to be uploaded
   * @returns true or false
   */
  private async isFileValidForTemplate(
    templateCode: string,
    fileSize: number,
    fileType: string,
  ) {
    const template = await this.templateRepository.findByCode(templateCode, [
      'mimeTypes',
    ]);

    const mimeType = template.mimeTypes.find(
      (mimeType) => mimeType.type === fileType,
    );

    if (mimeType === undefined) {
      throw new InvalidFileException('File format not supported');
    }

    if (fileSize > template.maxSize) {
      throw new InvalidFileException(
        `File size exceeded the maximum size ${template.maxSize}`,
      );
    }

    return true;
  }

  /**
   * generate storage path for the file
   * @param baseStoragePath - Base Storage Path of the project
   * @param slug - Slug
   * @param fileName - Name of the file to be uploaded with extension
   * @param referenceNumber - Reference number of the file request
   * @returns file storage path with extension
   */
  private generateStoragePath(
    baseStoragePath: string,
    fileName: string,
    referenceNumber: string,
  ): string {
    return `${baseStoragePath}/${referenceNumber}/${fileName}`;
  }

  /**
   * generate signed url expiry time
   * @param expiryTime - Expiry time in seconds
   * @returns moment object with addition of expiry time
   */
  private generateExpiryTime(expiryTime: number): moment.Moment {
    return moment().add(expiryTime, 'seconds');
  }

  /**
   * generate hash id
   * @param referenceNumber - External reference number
   * @param projectId - Project id
   * @returns unique uuid
   */
  private generateUuid(referenceNumber: string, projectId: number): string {
    return UtilsService.generateHash(`${referenceNumber}_${projectId}`, 'sha1');
  }
}
