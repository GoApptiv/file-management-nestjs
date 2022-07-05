import * as moment from 'moment';
import { Injectable, Logger } from '@nestjs/common';
import { FileRepository } from '../repositories/file.repository';
import { TemplateRepository } from '../repositories/template.repository';
import { File } from '../entities/file.entity';
import { FileStatus } from 'src/shared/constants/file-status.enum';
import { MimeTypeRepository } from '../repositories/mime-type.repository';
import { CloudStorageService } from 'src/shared/services/cloud-storage.service';
import { ReadSignedUrlResult } from '../results/read-signed-url.result';
import { ConfirmUploadResult } from '../results/confirm-upload.result';
import { WriteSignedUrlResult } from '../results/write-signed-url.result';
import { UtilsService } from 'src/shared/services/utils.service';
import { DuplicateReferenceNumberException } from '../exceptions/duplicate-reference-number.exception';
import { InvalidFileException } from '../exceptions/invalid-file.exception';
import { RegisterFileBO } from '../bo/register-file.bo';
import { FileDAO } from '../dao/file.dao';
import { EventEmitter2 } from 'eventemitter2';
import { ReadFileBO } from '../bo/read-file.bo';
import { FileAccessedEvent } from '../events/file-accessed.event';
import { ArchiveFileResult } from '../results/archive-file.result';
import { FileArchiveEvent } from '../events/file-archive.event';
import { BulkReadFileBO } from '../bo/bulk-read-file.bo';
import { BucketConfig } from 'src/modules/auth/entities/bucket-config.entity';
import { InvalidTemplateException } from '../exceptions/invalid-template.exception';
import { BulkReadSignedUrlResult } from '../results/bulk-read-signed-url.result';
import { CreateFileVariantBO } from '../bo/create-file-variant.bo';
import { FileVariantDAO } from '../dao/file-variant.dao';
import { PluginRepository } from 'src/modules/plugin/repositories/plugin.repository';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { FileVariantRepository } from '../repositories/file-variant.repository';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { FileVariantLogRepository } from '../repositories/file-variant-log.repository';
import { FileVariantLogDAO } from '../dao/file-variant-log.dao';
import { FileVariantPubSubMessage } from '../interfaces/file-variant-pubsub-message.interface';
import { FileVariantCreateResult } from '../results/file-variant-create.result';
import { CloudIAMService } from 'src/shared/services/cloud-iam.service';
import { GCP_SCOPE } from 'src/shared/constants/gcp-scope';
import { GCP_IAM_ACCESS_TOKEN_LIFETIME_IN_SECONDS } from 'src/shared/constants/constants';
import { FileVariantCfStatus } from 'src/shared/constants/file-variant-cf-status.enum';
import { InvalidPluginCodeException } from '../exceptions/invalid-plugin.exception';
import { UpdateFileVariantBO } from '../bo/update-file-variant.bo';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FileVariantReadResult } from '../results/file-variant-read.result';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly templateRepository: TemplateRepository,
    private readonly fileRepository: FileRepository,
    private readonly mimeTypeRepository: MimeTypeRepository,
    private readonly pluginRepository: PluginRepository,
    private readonly fileVariantRepository: FileVariantRepository,
    private readonly fileVariantLogRepository: FileVariantLogRepository,
    private readonly cloudPubSubService: CloudPubSubService,
  ) {}

  /**
   * generate signed url
   */
  async generateUploadSignedUrl(
    data: RegisterFileBO,
  ): Promise<WriteSignedUrlResult> {
    this.logger.log(
      `GENERATE SIGNED URL: ${data.projectId} : ${data.file.name}`,
    );

    const template = await this.templateRepository.findByCode(
      data.templateCode,
      ['bucketConfig'],
    );

    if (template === undefined) {
      this.logger.error(`INVALID TEMPLATE CODE: ${data.templateCode}`);
      throw new InvalidTemplateException();
    }

    const uuid = this.generateUuid(data.referenceNumber, data.projectId);
    const templateForUuId = await this.fileRepository.findByUuid(uuid);
    const archivalDate = moment().add(template.archiveAfterInD, 'days');

    if (templateForUuId !== undefined) {
      this.logger.error(`DUPLICATE REFERENCE NUMBER: ${data.referenceNumber}`);
      throw new DuplicateReferenceNumberException();
    }

    if (
      await this.isFileValidForTemplate(
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

      const expiryTime = this.generateExpiryTime(template.linkExpiryTimeInS);

      const storage = await this.getCloudStorageService(template.bucketConfig);

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
        archivalDate.toDate(),
      );

      this.logger.log(`SIGNED URL GENERATED: ${uuid} for ${data.file.name}`);

      return {
        uuid: store.uuid,
        url: signedUrl,
        reference_number: store.referenceNumber,
      };
    }
  }

  /**
   * confirm upload
   */
  async confirmUpload(uuid: string): Promise<ConfirmUploadResult> {
    this.logger.log(`CONFIRM UPLOAD: ${uuid}`);

    const updateResult = await this.fileRepository.updateByUuid(
      uuid,
      new FileDAO({
        isUploaded: true,
        status: FileStatus.UPLOADED,
      }),
    );

    this.logger.log(`CONFIRM UPLOAD COMPLETE: ${uuid}`);

    return {
      uuid,
      result: updateResult,
    };
  }

  /**
   * generate read signed url
   */
  async generateReadSignedUrl(
    data: ReadFileBO,
    projectId: number,
  ): Promise<ReadSignedUrlResult> {
    this.logger.log(`GENERATE READ SIGNED URL: ${data.uuid}`);

    const file = await this.fileRepository.findByUuidAndProjectId(
      data.uuid,
      projectId,
      ['template', 'template.bucketConfig'],
    );

    if (file === undefined || file.isUploaded === false) {
      this.logger.error(`INVALID UUID: ${data.uuid}`);
      throw new InvalidFileException('File does not exist');
    }

    const expiryTime = this.generateExpiryTime(file.template.linkExpiryTimeInS);

    const storage = await this.getCloudStorageService(
      file.template.bucketConfig,
    );

    const signedUrl = await storage.generateReadSignedUrl(
      file.storagePath,
      expiryTime,
    );

    this.logger.log(`READ SIGNED URL GENERATED: ${data.uuid}`);

    if (data.ip) {
      const fileAccessEvent = new FileAccessedEvent();
      fileAccessEvent.fileId = file.id;
      fileAccessEvent.ip = data.ip;
      fileAccessEvent.projectId = file.projectId;
      fileAccessEvent.userAgent = data.userAgent;
      fileAccessEvent.isArchived = file.isArchived;

      this.eventEmitter.emit('file.accessed', fileAccessEvent);
    }

    return { uuid: data.uuid, url: signedUrl };
  }

  /**
   * generates bulk read signed urls
   */
  async bulkGenerateReadSignedUrl(
    data: BulkReadFileBO,
    projectId: number,
  ): Promise<BulkReadSignedUrlResult> {
    const signedUrls: ReadSignedUrlResult[] = [];
    const uuids = data.uuids;
    const fileAccessEvents: FileAccessedEvent[] = [];

    this.logger.log(
      `GENERATE BULK READ SIGNED URL: ${uuids.length} UUID COUNT BY ${projectId}`,
    );

    const files = await this.fileRepository.fetchByUuidsAndProjectId(
      uuids,
      projectId,
      ['template', 'template.bucketConfig'],
    );

    for (const file of files) {
      if (file.isUploaded) {
        const expiryTime = this.generateExpiryTime(
          file.template.linkExpiryTimeInS,
        );

        const storage = await this.getCloudStorageService(
          file.template.bucketConfig,
        );

        const signedUrl = await storage.generateReadSignedUrl(
          file.storagePath,
          expiryTime,
        );

        signedUrls.push({
          uuid: file.uuid,
          url: signedUrl,
        });

        fileAccessEvents.push({
          fileId: file.id,
          projectId: projectId,
          ip: data.ip,
          userAgent: data.userAgent,
          isArchived: file.isArchived,
        });
      }
    }

    this.logger.log(
      `BULK READ SIGNED URL GENERATED: ${uuids.length} UUID COUNT BY ${projectId}`,
    );

    this.eventEmitter.emit('bulk-file.accessed', fileAccessEvents);

    return { urls: signedUrls };
  }

  /**
   * Archive Directory
   */
  async archiveDirectory(uuid: string): Promise<ArchiveFileResult> {
    this.logger.log(`ARCHIVE DIRECTORY CALLED FOR: ${uuid}`);

    const file = await this.fileRepository.findByUuid(uuid);

    if (file === undefined) {
      this.logger.error(`INVALID UUID: ${uuid}`);
      throw new InvalidFileException('File does not exist');
    }

    if (
      file.status !== FileStatus.UPLOADED &&
      file.status !== FileStatus.PROCESSED
    ) {
      this.logger.error(`INVALID STATUS: ${uuid}`);
      throw new InvalidFileException('File cannot be archived');
    }

    if (file.isArchived) {
      this.logger.error(`ALREADY ARCHIVED: ${uuid}`);
      throw new InvalidFileException('File already archived');
    }

    const archiveEvent = new FileArchiveEvent();
    archiveEvent.id = file.id;
    archiveEvent.isDirectory = true;

    this.eventEmitter.emit('file.archive', archiveEvent);
    this.logger.log(`ARCHIVE DIRECTORY EVENT EMITTED: ${uuid}`);

    return {
      uuid,
      processed: true,
    };
  }

  /**
   * generate file variant read signed url
   */
  async generateFileVariantReadSignedUrl(
    uuid: string,
    projectId: number,
  ): Promise<FileVariantReadResult[]> {
    const fileVariantsResponse: FileVariantReadResult[] = [];

    this.logger.log(`GENERATE FILE VARIANT READ SIGNED URL: ${uuid}`);

    const file = await this.fileRepository.findByUuidAndProjectId(
      uuid,
      projectId,
      ['template', 'template.bucketConfig'],
    );

    if (file === undefined || file.isUploaded === false) {
      this.logger.error(`INVALID UUID: ${uuid}`);
      throw new InvalidFileException('File does not exist');
    }

    const expiryTime = this.generateExpiryTime(file.template.linkExpiryTimeInS);

    const storage = await this.getCloudStorageService(
      file.template.bucketConfig,
    );

    const fileVariants =
      await this.fileVariantRepository.fetchByFileIdAndStatus(
        file.id,
        FileVariantStatus.CREATED,
        ['plugin'],
      );

    for (const fileVariant of fileVariants) {
      const signedUrl = await storage.generateReadSignedUrl(
        fileVariant.storagePath,
        expiryTime,
      );

      const response: FileVariantReadResult = {
        variantId: fileVariant.id,
        url: signedUrl,
        pluginCode: fileVariant.plugin.code,
      };

      fileVariantsResponse.push(response);
    }

    this.logger.log(`FILE VARIANT READ SIGNED URL GENERATED: ${uuid}`);

    return fileVariantsResponse;
  }

  /**
   * Makes File Plugin Variant creations async request
   */
  async createFileVariants(
    data: CreateFileVariantBO,
    projectId: number,
  ): Promise<FileVariantCreateResult[]> {
    this.logger.log(
      `CREATE FILE VARIANT: ${data.uuid} FOR PROJECT: ${projectId}`,
    );

    const uuid = data.uuid;
    const file = await this.fileRepository.findByUuidAndProjectId(
      uuid,
      projectId,
      ['template', 'template.bucketConfig'],
    );

    // check if file exists
    if (file === undefined || file.isUploaded === false) {
      this.logger.error(`INVALID UUID: ${uuid}`);
      throw new InvalidFileException('File does not exist');
    }

    const fileVariants = [];

    for (const plugin of data.plugins) {
      const pluginData = await this.pluginRepository.findByCode(plugin.code);

      if (pluginData === undefined) {
        throw new InvalidPluginCodeException();
      }

      // check if the file variant already exists
      const fileVariantsInSystem =
        await this.fileVariantRepository.fetchByFileIdAndPluginId(
          file.id,
          pluginData.id,
        );

      // if file variant already exists and not in error and delete state, append the result and skip
      let createVariant = true;

      fileVariantsInSystem.forEach((fileVariant) => {
        if (
          [FileVariantStatus.QUEUED, FileVariantStatus.CREATED].includes(
            fileVariant.status,
          )
        ) {
          const response: FileVariantCreateResult = {
            variantId: fileVariant.id,
            pluginCode: plugin.code,
            status: fileVariant.status,
          };

          this.logger.log(
            `FILE VARIANT ALREADY EXISTS: ${uuid} FOR PLUGIN: ${plugin.code}`,
          );

          fileVariants.push(response);
          createVariant = false;
        }
      });

      if (createVariant) {
        this.logger.log(
          `Creating file variant: ${uuid} for plugin: ${plugin.code}`,
        );
        const fileVariant = new FileVariantDAO();
        fileVariant.fileId = file.id;
        fileVariant.pluginId = pluginData.id;
        fileVariant.status = FileVariantStatus.REQUESTED;

        const fileStoragePath = this.generateFileNamePathFromStoragePath(
          file.storagePath,
        );

        this.logger.log(`Creating IAM token for file variant: ${uuid}`);
        const iamService = await this.getCloudIAMService(
          file.template.bucketConfig.email,
          this.decodeBucketConfigPrivateKey(file.template.bucketConfig.key),
        );

        const bucketReadOnlyToken = await iamService.generateAccessToken(
          file.template.bucketConfig.email,
          [GCP_SCOPE.cloudStorage.readOnly],
          GCP_IAM_ACCESS_TOKEN_LIFETIME_IN_SECONDS,
        );

        const bucketWriteOnlyToken = await iamService.generateAccessToken(
          file.template.bucketConfig.email,
          [GCP_SCOPE.cloudStorage.writeOnly],
          GCP_IAM_ACCESS_TOKEN_LIFETIME_IN_SECONDS,
        );

        const readSignedUrlData = new ReadFileBO();
        readSignedUrlData.uuid = uuid;

        const readSignedUrl = await this.generateReadSignedUrl(
          readSignedUrlData,
          projectId,
        );

        // store data in file variant
        const fileVariantData = await this.fileVariantRepository.store(
          fileVariant,
        );

        this.logger.log(
          `Creating pub/sub message for file variant: ${uuid} and plugin: ${plugin.code}`,
        );
        const pubsubMessage: FileVariantPubSubMessage = {
          metadata: {
            uuid: file.uuid,
            variantId: fileVariantData.id,
            projectId,
          },
          response: {
            topic: pluginData.cloudFunctionResponseTopic,
          },
          bucket: {
            source: {
              readSignedUrl: readSignedUrl.url,
              bucketName: file.template.bucketConfig.name,
              accessToken: bucketReadOnlyToken.accessToken,
              path: fileStoragePath.filePath,
              file: fileStoragePath.fileName,
            },
            destination: {
              bucketName: file.template.bucketConfig.name,
              accessToken: bucketWriteOnlyToken.accessToken,
              path: fileStoragePath.filePath,
            },
          },
        };

        this.logger.log(
          `Publishing pub/sub message for file variant: ${uuid} and plugin: ${plugin.code}`,
        );
        const pubsubMessageId = await this.cloudPubSubService.publishMessage(
          pluginData.cloudFunctionTopic,
          pubsubMessage,
        );

        // if pub/sub message is published successfully, update file variant status to queued
        if (pubsubMessageId !== null) {
          this.logger.log(
            `Pub/sub message published for file variant: ${uuid} and plugin: ${plugin.code}`,
          );
          await this.fileVariantRepository.updateStatusById(
            fileVariantData.id,
            FileVariantStatus.QUEUED,
          );

          const fileVariantLog = new FileVariantLogDAO();
          fileVariantLog.variantId = fileVariant.id;
          fileVariantLog.pluginId = pluginData.id;
          fileVariantLog.status = FileVariantStatus.QUEUED;
          fileVariantLog.messageId = pubsubMessageId;

          await this.fileVariantLogRepository.store(fileVariantLog);

          const response: FileVariantCreateResult = {
            variantId: fileVariant.id,
            pluginCode: plugin.code,
            status: FileVariantStatus.QUEUED,
          };

          fileVariants.push(response);
        } else {
          // if pub/sub message is not published successfully, update file variant status to error
          this.logger.error(
            `Pub/sub message not published for file variant: ${uuid} and plugin: ${plugin.code}`,
          );
          await this.fileVariantRepository.updateStatusById(
            fileVariantData.id,
            FileVariantStatus.ERROR,
          );

          const response: FileVariantCreateResult = {
            variantId: fileVariant.id,
            pluginCode: plugin.code,
            status: FileVariantStatus.ERROR,
          };

          fileVariants.push(response);
        }
      }
    }

    this.logger.log(`FILE VARIANTS CREATION QUEUED: ${uuid}`);

    return fileVariants;
  }

  /**
   * Updates file variant
   */
  async updateFileVariantByCfResponse(
    variantId: number,
    data: UpdateFileVariantBO,
  ): Promise<boolean> {
    this.logger.log(
      `UPDATING FILE VARIANT: ${variantId} FROM CLOUD FUNCTION RESPONSE`,
    );

    let status = FileVariantStatus.CREATED;

    if (data.cfStatus == FileVariantCfStatus.SUCCESS) {
      status = FileVariantStatus.CREATED;
    } else {
      status = FileVariantStatus.ERROR;
    }

    const update = await this.fileVariantRepository.updateById(
      variantId,
      new FileVariantDAO({
        status: status,
        storagePath: data.filePath.replace(/\/$/, '') + '/' + data.fileName,
      }),
    );

    const fileVariant = await this.fileVariantRepository.findById(variantId);

    const fileVariantLog = new FileVariantLogDAO();
    fileVariantLog.variantId = variantId;
    fileVariantLog.pluginId = fileVariant.pluginId;
    fileVariantLog.status = status;
    fileVariantLog.messageId = data.messageId;

    await this.fileVariantLogRepository.store(fileVariantLog);

    this.logger.log(`FILE VARIANT UPDATED: ${variantId}`);

    return update;
  }

  /**
   * Store file request in the database
   */
  private async storeFileUploadRequest(
    data: RegisterFileBO,
    uuid: string,
    storagePath: string,
    templateId: number,
    archivalDate: Date,
  ): Promise<File> {
    const mimeType = await this.mimeTypeRepository.findByType(data.file.type);

    const file = new FileDAO();
    file.fileSize = data.file.size;
    file.uuid = uuid;
    file.isArchived = false;
    file.isUploaded = false;
    file.status = FileStatus.REQUESTED;
    file.storagePath = storagePath;
    file.referenceNumber = data.referenceNumber;
    file.projectId = data.projectId;
    file.mimeTypeId = mimeType.id;
    file.templateId = templateId;
    file.archivalDate = archivalDate;

    return this.fileRepository.store(file);
  }

  /**
   * validate file to be uploaded

   */
  private async isFileValidForTemplate(
    templateCode: string,
    fileSize: number,
    fileType: string,
  ): Promise<boolean> {
    const template = await this.templateRepository.findByCode(templateCode, [
      'mimeTypes',
    ]);

    const mimeType = template.mimeTypes.find(
      (mimeType) => mimeType.type === fileType,
    );

    if (mimeType === undefined) {
      this.logger.log(`MIME TYPE NOT FOUND: ${fileType}`);
      throw new InvalidFileException('File format not supported');
    }

    if (fileSize > template.maxSizeInB) {
      this.logger.log(`FILE SIZE EXCEEDED: ${fileSize}`);
      throw new InvalidFileException(
        `File size exceeded the maximum size ${template.maxSizeInB}`,
      );
    }

    return true;
  }

  /**
   * generate storage path for the file
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
   */
  private generateExpiryTime(expiryTime: number): moment.Moment {
    return moment().add(expiryTime, 'seconds');
  }

  /**
   * generate hash id
   */
  private generateUuid(referenceNumber: string, projectId: number): string {
    return UtilsService.generateHash(`${referenceNumber}_${projectId}`, 'sha1');
  }

  /**
   * initialize the storage for the bucket config
   */
  private async getCloudStorageService(
    bucketConfig: BucketConfig,
  ): Promise<CloudStorageService> {
    return new CloudStorageService(
      bucketConfig.email,
      this.decodeBucketConfigPrivateKey(bucketConfig.key),
      bucketConfig.name,
    );
  }

  /**
   * initialize the iam client
   */
  private async getCloudIAMService(
    clientEmail: string,
    privateKey: string,
  ): Promise<CloudIAMService> {
    return new CloudIAMService(clientEmail, privateKey);
  }

  /**
   * returns fileName and filePath
   */
  private generateFileNamePathFromStoragePath(storagePath: string): {
    fileName: string;
    filePath: string;
  } {
    const storagePathSplit = storagePath.split('/');
    const filePath = storagePathSplit
      .splice(0, storagePathSplit.length - 1)
      .join('/');
    const fileName = storagePathSplit[storagePathSplit.length - 1];

    return { filePath, fileName };
  }

  /**
   * decodes bucket private key
   */
  private decodeBucketConfigPrivateKey(key: string): string {
    return UtilsService.base64decodeKey(key);
  }

  /**
   * Fails the queued file variants
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  private async failQueuedFileVariantsBeforeMinutes(
    minutes = Number(10),
  ): Promise<void> {
    this.logger.log(`FAILING QUEUED FILE VARIANTS BEFORE ${minutes} MINUTES`);
    const fileVariants =
      await this.fileVariantRepository.fetchByStatusAndBeforeDateTime(
        FileVariantStatus.QUEUED,
        moment().subtract(minutes, 'minutes').toDate(),
      );

    for (const fileVariant of fileVariants) {
      await this.fileVariantRepository.updateById(
        fileVariant.id,
        new FileVariantDAO({
          status: FileVariantStatus.ERROR,
        }),
      );

      this.logger.log(
        `File variant failed to no status update: ${fileVariant.id}`,
      );

      const fileVariantLog = new FileVariantLogDAO();
      fileVariantLog.variantId = fileVariant.id;
      fileVariantLog.pluginId = fileVariant.pluginId;
      fileVariantLog.status = FileVariantStatus.ERROR;

      await this.fileVariantLogRepository.store(fileVariantLog);
    }

    this.logger.log(
      `FAILED QUEUED FILE VARIANTS BEFORE ${minutes} MINUTES COMPLETE`,
    );
  }

  /**
   * archive the file which passed the archival date
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  private async archiveArchivalDatePassedFiles(): Promise<void> {
    this.logger.log(`ARCHIVING FILES WITH ARCHIVAL DATE PASSED`);
    const files =
      await this.fileRepository.fetchByStatusAndBeforeArchivalDateTime(
        FileStatus.UPLOADED,
        moment().toDate(),
      );

    this.logger.log(`${files.length} FILES FOUND FOR ARCHIVAL`);

    for (const file of files) {
      this.archiveDirectory(file.uuid);
    }
    this.logger.log(`ARCHIVING FILES WITH ARCHIVAL DATE PASSED COMPLETE`);
  }
}
