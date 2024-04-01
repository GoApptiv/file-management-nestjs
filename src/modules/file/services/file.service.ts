import moment from 'moment';
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
import { StoreFileDAO } from '../dao/file.dao';
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
import { StoreFileVariantDAO } from '../dao/file-variant.dao';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { FileVariantRepository } from '../repositories/file-variant.repository';
import { CloudPubSubService } from 'src/shared/services/cloud-pubsub.service';
import { FileVariantLogRepository } from '../repositories/file-variant-log.repository';
import { StoreFileVarianLogDAO } from '../dao/file-variant-log.dao';
import { FileVariantPubSubMessage } from '../interfaces/file-variant-pubsub-message.interface';
import { FileVariantCreateResult } from '../results/file-variant-create.result';
import { CloudIAMService } from 'src/shared/services/cloud-iam.service';
import { GCP_SCOPE } from 'src/shared/constants/gcp-scope';
import { GCP_IAM_ACCESS_TOKEN_LIFETIME_IN_SECONDS } from 'src/shared/constants/constants';
import { FileVariantCfStatus } from 'src/shared/constants/file-variant-cf-status.enum';
import { UpdateFileVariantBO } from '../bo/update-file-variant.bo';
import { FileVariantReadResult } from '../results/file-variant-read.result';
import { PluginRepository } from '../repositories/plugin.repository';
import { InvalidPluginException } from '../exceptions/invalid-plugin.exception';
import {
  GaConflictException,
  GaNotFoundException,
} from '@goapptiv/exception-handler-nestjs';
import { FileErrorCode } from '../constants/errors.enum';
import { FileNotUploadedException } from '../exceptions/file-not-uploaded.exception';

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
   * Generate signed url
   */
  async generateUploadSignedUrl(
    data: RegisterFileBO,
  ): Promise<WriteSignedUrlResult> {
    this.logger.log(
      `generate signed url for file: ${data.file.name} with ref: ${data.referenceNumber} and created by: ${data.createdBy}`,
    );

    const template = await this.templateRepository.findByCodeAndProjectId(
      data.templateCode,
      data.projectId,
      ['bucketConfig'],
    );

    if (!template) {
      throw new InvalidTemplateException(data.templateCode);
    }

    const uuid = this.generateUuid(data.referenceNumber, data.projectId);
    const templateForUuId = await this.fileRepository.findByUuid(uuid);
    const archivalDate = moment().add(template.archiveAfterInD, 'days');

    if (templateForUuId) {
      throw new DuplicateReferenceNumberException(data.referenceNumber);
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

      const storage = this.getCloudStorageService(template.bucketConfig);

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

      this.logger.log(
        `signed url generated for file: ${data.file.name} with uuid: ${uuid}`,
      );

      return {
        uuid: store.uuid,
        url: signedUrl,
        // eslint-disable-next-line camelcase
        reference_number: store.referenceNumber,
      };
    }
  }

  /**
   * Confirm upload
   */
  async confirmUpload(uuid: string): Promise<ConfirmUploadResult> {
    this.logger.log(`confirm upload for file with uuid: ${uuid}`);

    const file = await this.fileRepository.findByUuid(uuid, [
      'template',
      'template.bucketConfig',
    ]);

    const storage = this.getCloudStorageService(file.template.bucketConfig);

    const isUploaded = await storage.fileExists(file.storagePath);

    if (!isUploaded) {
      throw new FileNotUploadedException(uuid);
    }

    const updateResult =
      await this.fileRepository.updateStatusAndIsUploadedByUuid(
        uuid,
        FileStatus.UPLOADED,
        true,
      );

    this.logger.log(`file with uuid: ${uuid} confirmed uploaded`);

    return {
      uuid,
      result: updateResult,
    };
  }

  /**
   * Generate read signed url
   */
  async generateReadSignedUrl(
    data: ReadFileBO,
    projectId: number,
    isAdmin = false,
  ): Promise<ReadSignedUrlResult> {
    this.logger.log(
      `generate read signed url for file with uuid: ${data.uuid} for project: ${projectId}`,
    );

    const file = await this.fileRepository.findByUuid(data.uuid, [
      'template',
      'template.bucketConfig',
    ]);

    if (
      !file ||
      file.isUploaded === false ||
      (!isAdmin && file.projectId !== projectId)
    ) {
      throw new InvalidFileException(data.uuid);
    }

    const expiryTime = this.generateExpiryTime(file.template.linkExpiryTimeInS);

    const storage = this.getCloudStorageService(file.template.bucketConfig);

    const signedUrl = await storage.generateReadSignedUrl(
      file.storagePath,
      expiryTime,
    );

    this.logger.log(
      `read signed url generated for file with uuid: ${data.uuid}`,
    );

    if (data.ip) {
      const fileAccessEvent = new FileAccessedEvent();
      fileAccessEvent.fileId = file.id;
      fileAccessEvent.ip = data.ip;
      fileAccessEvent.projectId = projectId;
      fileAccessEvent.userAgent = data.userAgent;
      fileAccessEvent.isArchived = file.isArchived;

      this.eventEmitter.emit('file.accessed', fileAccessEvent);
    }

    return { uuid: data.uuid, url: signedUrl };
  }

  /**
   * Generates bulk read signed urls
   */
  async bulkGenerateReadSignedUrl(
    data: BulkReadFileBO,
    projectId: number,
    isAdmin = false,
  ): Promise<BulkReadSignedUrlResult> {
    const signedUrls: ReadSignedUrlResult[] = [];
    const uuids = data.uuids;
    const fileAccessEvents: FileAccessedEvent[] = [];

    this.logger.log(
      `generate bulk read signed url for files with uuids count: ${uuids.length} requested by project: ${projectId}`,
    );

    const files = await this.fileRepository.fetchByUuids(uuids, [
      'template',
      'template.bucketConfig',
    ]);

    if (!isAdmin) {
      files.forEach((file: File) => {
        if (file.projectId !== projectId) {
          files.splice(files.indexOf(file), 1);
        }
      });
    }

    for (const file of files) {
      if (file.isUploaded) {
        const expiryTime = this.generateExpiryTime(
          file.template.linkExpiryTimeInS,
        );

        const storage = this.getCloudStorageService(file.template.bucketConfig);

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
      `bulk read signed url generated for files with uuids count: ${uuids.length}`,
    );

    this.eventEmitter.emit('bulk-file.accessed', fileAccessEvents);

    return { urls: signedUrls };
  }

  /**
   * Archive Directory
   */
  async archiveDirectory(uuid: string): Promise<ArchiveFileResult> {
    this.logger.log(`archive directory called for file with uuid: ${uuid}`);

    const file = await this.fileRepository.findByUuid(uuid);

    if (!file) {
      throw new InvalidFileException(uuid);
    }

    if (
      file.status !== FileStatus.UPLOADED &&
      file.status !== FileStatus.PROCESSED
    ) {
      throw new GaConflictException([
        {
          type: FileErrorCode.E409_FILE_ARCHIVE_STATE_NOT_ALLOWED,
          message: 'File is not in a valid state to be archived',
          context: {
            uuid,
          },
        },
      ]);
    }

    if (file.isArchived) {
      throw new GaConflictException([
        {
          type: FileErrorCode.E409_FILE_ARCHIVE_ALREADY_ARCHIVED,
          message: `File with uuid: ${uuid} is already archived`,
          context: {
            uuid,
          },
        },
      ]);
    }

    const archiveEvent = new FileArchiveEvent();
    archiveEvent.id = file.id;
    archiveEvent.isDirectory = true;

    this.eventEmitter.emit('file.archive', archiveEvent);
    this.logger.log(
      `archive directory event emitted for file with uuid: ${uuid}`,
    );

    return {
      uuid,
      processed: true,
    };
  }

  /**
   * Generate file variant read signed url
   */
  async generateFileVariantReadSignedUrl(
    uuid: string,
    projectId: number,
    isAdmin = false,
  ): Promise<FileVariantReadResult[]> {
    const fileVariantsResponse: FileVariantReadResult[] = [];

    this.logger.log(
      `generate file variant read signed url for file with uuid: ${uuid} for project: ${projectId}`,
    );

    const file = await this.fileRepository.findByUuid(uuid, [
      'template',
      'template.bucketConfig',
    ]);

    if (
      !file ||
      file.isUploaded === false ||
      (!isAdmin && file.projectId !== projectId)
    ) {
      throw new InvalidFileException(uuid);
    }

    const expiryTime = this.generateExpiryTime(file.template.linkExpiryTimeInS);

    const storage = this.getCloudStorageService(file.template.bucketConfig);

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

    this.logger.log(
      `file variant read signed url generated for file with uuid: ${uuid}`,
    );

    return fileVariantsResponse;
  }

  /**
   * Makes File Plugin Variant creations async request
   */
  async createFileVariants(
    data: CreateFileVariantBO,
    projectId: number,
    isAdmin = false,
  ): Promise<FileVariantCreateResult[]> {
    this.logger.log(
      `create file variants called for file with uuid: ${data.uuid} requested by project: ${projectId}`,
    );

    const uuid = data.uuid;
    const file = await this.fileRepository.findByUuid(uuid, [
      'template',
      'template.bucketConfig',
    ]);

    // Check if file exists
    if (
      !file ||
      file.isUploaded === false ||
      (!isAdmin && file.projectId !== projectId)
    ) {
      throw new InvalidFileException(uuid);
    }

    const fileVariants = [];

    for (const plugin of data.plugins) {
      const pluginData = await this.pluginRepository.findByCode(plugin.code);

      if (!pluginData) {
        throw new InvalidPluginException(plugin.code);
      }

      // Check if the file variant already exists
      const fileVariantsInSystem =
        await this.fileVariantRepository.fetchByFileIdAndPluginId(
          file.id,
          pluginData.id,
        );

      // If file variant already exists and not in error and delete state, append the result and skip
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

          this.logger.warn(
            `FILE VARIANT ALREADY EXISTS: ${uuid} FOR PLUGIN: ${plugin.code}`,
          );

          fileVariants.push(response);
          createVariant = false;
        }
      });

      if (createVariant) {
        this.logger.log(
          `creating file variant for file with uuid: ${uuid} for plugin: ${plugin.code}`,
        );
        const fileVariant: StoreFileVariantDAO = {
          fileId: file.id,
          pluginId: pluginData.id,
          status: FileVariantStatus.REQUESTED,
          createdBy: projectId,
        };

        const fileStoragePath = this.generateFileNamePathFromStoragePath(
          file.storagePath,
        );

        this.logger.log(`creating iam token for file variant: ${uuid}`);
        const iamService = this.getCloudIAMService(
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

        const readSignedUrlData: ReadFileBO = {
          uuid,
        };

        const readSignedUrl = await this.generateReadSignedUrl(
          readSignedUrlData,
          projectId,
          isAdmin,
        );

        // Store data in file variant
        const fileVariantData = await this.fileVariantRepository.store(
          fileVariant,
        );

        this.logger.log(
          `generating pub/sub message for file: ${uuid} and plugin: ${plugin.code}`,
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
          `publishig pub/sub message for file: ${uuid} and plugin: ${plugin.code}`,
        );

        const pubsubMessageId = await this.cloudPubSubService.publishMessage(
          pluginData.cloudFunctionTopic,
          pubsubMessage,
        );

        // If pub/sub message is published successfully, update file variant status to queued
        if (pubsubMessageId !== null) {
          this.logger.log(
            `pub/sub message published for file: ${uuid} and plugin: ${plugin.code} with id: ${pubsubMessageId}`,
          );
          await this.fileVariantRepository.updateStatusById(
            fileVariantData.id,
            FileVariantStatus.QUEUED,
          );

          const fileVariantLog: StoreFileVarianLogDAO = {
            variantId: fileVariantData.id,
            pluginId: pluginData.id,
            status: FileVariantStatus.QUEUED,
            messageId: pubsubMessageId,
          };

          await this.fileVariantLogRepository.store(fileVariantLog);

          const response: FileVariantCreateResult = {
            variantId: fileVariantData.id,
            pluginCode: plugin.code,
            status: FileVariantStatus.QUEUED,
          };

          fileVariants.push(response);
        } else {
          // If pub/sub message is not published successfully, update file variant status to error
          this.logger.warn(
            `PUB/SUB MESSAGE NOT PUBLISHED FOR FILE: ${uuid} AND PLUGIN: ${plugin.code}`,
          );

          await this.fileVariantRepository.updateStatusById(
            fileVariantData.id,
            FileVariantStatus.ERROR,
          );

          const response: FileVariantCreateResult = {
            variantId: fileVariantData.id,
            pluginCode: plugin.code,
            status: FileVariantStatus.ERROR,
          };

          fileVariants.push(response);
        }
      }
    }

    this.logger.log(`file variants creating queued for file: ${uuid}`);

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
      `updating file variant: ${variantId} status from cloud function response`,
    );

    let status = FileVariantStatus.CREATED;

    if (data.cfStatus == FileVariantCfStatus.SUCCESS) {
      status = FileVariantStatus.CREATED;
    } else {
      status = FileVariantStatus.ERROR;
    }

    const update =
      await this.fileVariantRepository.updateStatusAndStoragePathById(
        variantId,
        status,
        data.filePath.replace(/\/$/, '') + '/' + data.fileName,
      );

    const fileVariant = await this.fileVariantRepository.findById(variantId);

    const fileVariantLog: StoreFileVarianLogDAO = {
      variantId: variantId,
      pluginId: fileVariant.pluginId,
      status: status,
      messageId: data.messageId,
    };

    await this.fileVariantLogRepository.store(fileVariantLog);

    this.logger.log(`file variant: ${variantId} status updated to: ${status}`);

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

    const file: StoreFileDAO = {
      fileSize: data.file.size,
      uuid: uuid,
      isArchived: false,
      isUploaded: false,
      status: FileStatus.REQUESTED,
      storagePath: storagePath,
      referenceNumber: data.referenceNumber,
      projectId: data.projectId,
      createdBy: data.createdBy,
      mimeTypeId: mimeType.id,
      templateId: templateId,
      archivalDate: archivalDate,
    };

    return this.fileRepository.store(file);
  }

  /**
   * Validate file to be uploaded

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

    if (!mimeType) {
      throw new GaNotFoundException([
        {
          type: FileErrorCode.E404_FILE_MIME_TYPE,
          message: `File mime type ${fileType} is not allowed for template ${templateCode}`,
          context: {
            templateCode,
            fileType,
            mimeType,
          },
        },
      ]);
    }

    if (fileSize > template.maxSizeInB) {
      throw new GaConflictException([
        {
          type: FileErrorCode.E409_FILE_SIZE_EXCEEDED,
          message: `File size ${fileSize} is greater than allowed size ${template.maxSizeInB} for template ${templateCode}`,
          context: {
            templateCode,
            fileSize,
            maxSize: template.maxSizeInB,
          },
        },
      ]);
    }

    return true;
  }

  /**
   * Generate storage path for the file
   */
  private generateStoragePath(
    baseStoragePath: string,
    fileName: string,
    referenceNumber: string,
  ): string {
    return `${baseStoragePath}/${referenceNumber}/${fileName}`;
  }

  /**
   * Generate signed url expiry time
   */
  private generateExpiryTime(expiryTime: number): moment.Moment {
    return moment().add(expiryTime, 'seconds');
  }

  /**
   * Generate hash id
   */
  private generateUuid(referenceNumber: string, projectId: number): string {
    return UtilsService.generateHash(`${referenceNumber}_${projectId}`, 'sha1');
  }

  /**
   * Initialize the storage for the bucket config
   */
  private getCloudStorageService(
    bucketConfig: BucketConfig,
  ): CloudStorageService {
    return new CloudStorageService(
      bucketConfig.email,
      this.decodeBucketConfigPrivateKey(bucketConfig.key),
      bucketConfig.name,
    );
  }

  /**
   * Initialize the iam client
   */
  private getCloudIAMService(
    clientEmail: string,
    privateKey: string,
  ): CloudIAMService {
    return new CloudIAMService(clientEmail, privateKey);
  }

  /**
   * Returns fileName and filePath
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
   * Decodes bucket private key
   */
  private decodeBucketConfigPrivateKey(key: string): string {
    return UtilsService.base64decodeKey(key);
  }

  /**
   * Fails the queued file variants
   */
  async failQueuedFileVariants(minutes = Number(10)): Promise<boolean> {
    this.logger.log(`failing queued file variants before ${minutes} minutes`);

    const fileVariants =
      await this.fileVariantRepository.fetchByStatusAndBeforeDateTime(
        FileVariantStatus.QUEUED,
        moment().subtract(minutes, 'minutes').toDate(),
      );

    for (const fileVariant of fileVariants) {
      await this.fileVariantRepository.updateStatusById(
        fileVariant.id,
        FileVariantStatus.ERROR,
      );

      this.logger.log(
        `file variant failed to no status update: ${fileVariant.id}`,
      );

      const fileVariantLog: StoreFileVarianLogDAO = {
        variantId: fileVariant.id,
        pluginId: fileVariant.pluginId,
        status: FileVariantStatus.ERROR,
        messageId: '',
      };

      await this.fileVariantLogRepository.store(fileVariantLog);
    }

    this.logger.log(`file variants failed: ${fileVariants.length}`);

    return true;
  }

  /**
   * Archive the file which passed the archival date
   */
  async archiveArchivalDatePassedFiles(): Promise<boolean> {
    this.logger.log(`archiving files with archival date passed`);

    const files =
      await this.fileRepository.fetchByStatusAndBeforeArchivalDateTimeAndIsArchivedStatus(
        FileStatus.UPLOADED,
        moment().toDate(),
        false,
        1000,
      );

    this.logger.log(`${files.length} files found for archival`);

    for (const file of files) {
      await this.archiveDirectory(file.uuid);
    }
    this.logger.log(
      `archived files with archival date passed completed for: ${files.length}`,
    );

    return true;
  }
}
