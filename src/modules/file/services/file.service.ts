import { Injectable } from '@nestjs/common';
import { FileRepository } from '../repositories/file.repository';
import { TemplateRepository } from '../repositories/template.repository';
import * as moment from 'moment';
import { UtilsProvider } from 'src/shared/services/utils.service';
import { RegisterFileDto } from '../dto/register-file-dto';
import { File } from '../entities/file.entity';
import { FileStatus } from 'src/shared/constants/file-status';
import { ProjectRepository } from 'src/modules/auth/repositories/project.repository';
import { MimeTypeRepository } from '../repositories/mime-type.repository';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';

@Injectable()
export class FileService {
  constructor(
    private readonly templateRepository: TemplateRepository,
    private readonly fileRepository: FileRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly mimeTypeRepository: MimeTypeRepository,
  ) {}

  /**
   * generate signed url
   * @param {string} text
   * @returns {string}
   */
  getUploadSignedUrl = async (dto: RegisterFileDto): Promise<any> => {
    const template = await this.templateRepository.findOne({
      where: { code: dto.template_code },
    });

    const hashId = this.generateHashId(dto.reference_number, 1);
    const templateForHashId = await this.fileRepository.findOne({ hashId });

    if (templateForHashId !== undefined) {
      throw 'External reference id already exists';
    }

    if (
      this.isFileValidForTemplate(
        dto.template_code,
        dto.file_size,
        dto.file_type,
      )
    ) {
      const storagePath = this.generateStoragePath(
        template.baseStoragePath,
        1,
        dto.file_name,
      );

      const store = await this.storeFileUploadRequest(
        dto,
        1,
        hashId,
        storagePath,
      );

      const expiryTime = this.generateExpiryTime(template.linkExpiryTime);

      const signedUrl = this.generateUploadSignedUrl(
        storagePath,
        dto.file_type,
        expiryTime,
      );

      return {
        id: store.hashId,
        signed_url: signedUrl,
        reference_number: store.referenceNumber,
      };
    }
  };

  /**
   *
   * @param {RegisterFileDto} dto
   * @param {number} projectId
   * @param {string} hashId
   * @param {string} storagePath
   * @returns {Promise<File>}
   */
  private storeFileUploadRequest = async (
    dto: RegisterFileDto,
    projectId: number,
    hashId: string,
    storagePath: string,
  ): Promise<File> => {
    const project = await this.projectRepository.findOne(projectId);
    const mimeType = await this.mimeTypeRepository.findOne({
      type: dto.file_type,
    });
    const template = await this.templateRepository.findOne({
      code: dto.template_code,
    });

    const file = new File();
    file.fileSize = dto.file_size;
    file.hashId = hashId;
    file.isArchieved = false;
    file.isUploaded = false;
    file.status = FileStatus.REQUESTED;
    file.storagePath = storagePath;
    file.referenceNumber = dto.reference_number;
    file.project = project;
    file.mimeType = mimeType;
    file.template = template;

    return this.fileRepository.save(file);
  };

  /**
   * validate file to be uploaded
   * @param {string} templateCode
   * @param {number} fileSize
   * @param {string} fileType
   * @returns {boolean}
   */
  private isFileValidForTemplate = async (
    templateCode: string,
    fileSize: number,
    fileType: string,
  ) => {
    const template = await this.templateRepository.findOne({
      where: { code: templateCode },
      relations: ['mimeTypes'],
    });

    const mimeType = template.mimeTypes.find(
      (mimeType) => mimeType.type === fileType,
    );

    if (mimeType === undefined) {
      throw 'File format not supported';
    }

    if (fileSize > template.maxSize) {
      throw `File size exceeded the maximum size ${template.maxSize}`;
    }

    return true;
  };

  /**
   * generate storage path for the file
   * @param {string} baseStoragePath
   * @param {string} slug
   * @param {string} fileName
   * @returns {string}
   */
  private generateStoragePath = (
    baseStoragePath: string,
    slug: number,
    fileName: string,
  ): string => {
    return `${baseStoragePath}/${slug}/${fileName}`;
  };

  /**
   * generate signed url expiry time
   * @param {number|null} expiryTime
   * @returns {moment.Moment}
   */
  private generateExpiryTime = (expiryTime: number | null): moment.Moment => {
    if (expiryTime === null) {
      return null;
    }
    return moment().add(expiryTime, 'seconds');
  };

  /**
   * generate hash id
   * @param {string} referenceNumber
   * @param {number} projectId
   * @returns {string}
   */
  private generateHashId = (
    referenceNumber: string,
    projectId: number,
  ): string => {
    return UtilsProvider.generateHash(
      `${referenceNumber}_${projectId}`,
      'sha1',
    );
  };

  /**
   * generate upload signed url
   * @param {string} path
   * @param {string} fileType
   * @param {momemt.Moment} expiryTime
   * @returns {string}
   */
  private generateUploadSignedUrl = async (
    path: string,
    fileType: string,
    expiryTime: moment.Moment,
  ): Promise<string> => {
    const storage = new Storage({});

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'write',
      expires: expiryTime.toDate(),
      contentType: fileType,
    };

    // Get a v4 signed URL for uploading file
    const [url] = await storage.bucket('demo').file(path).getSignedUrl(options);

    return url;
  };
}
