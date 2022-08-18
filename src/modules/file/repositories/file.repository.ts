import { FileStatus } from 'src/shared/constants/file-status.enum';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { StoreFileDAO } from '../dao/file.dao';
import { File } from '../entities/file.entity';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  /**
   * Creates new record
   */
  async store(data: StoreFileDAO): Promise<File> {
    return await this.save(data);
  }

  /**
   * Finds entity which matches the uuid
   */
  async findByUuid(
    uuid: string,
    relations?: (keyof File)[] | string[],
  ): Promise<File> {
    return await this.findOne({ where: { uuid }, relations: relations });
  }

  /**
   * Finds entity which matches the uuid and projectId
   */
  async findByUuidAndProjectId(
    uuid: string,
    projectId: number,
    relations?: (keyof File)[] | string[],
  ): Promise<File> {
    return await this.findOne({
      where: { uuid, projectId },
      relations: relations,
    });
  }

  /**
   * Fetch entity which matches the uuids
   */
  async fetchByUuids(
    uuids: [],
    relations?: (keyof File)[] | string[],
  ): Promise<File[]> {
    return await this.find({
      where: {
        uuid: In(uuids),
      },
      relations: relations,
    });
  }

  /**
   * Fetch entity which matches the uuids and projectId
   */
  async fetchByUuidsAndProjectId(
    uuids: [],
    projectId: number,
    relations?: (keyof File)[] | string[],
  ): Promise<File[]> {
    return await this.find({
      where: {
        uuid: In(uuids),
        projectId,
      },
      relations: relations,
    });
  }

  /**
   * update the status and isUploaded by uuid
   */
  async updateStatusAndIsUploadedByUuid(
    uuid: string,
    status: FileStatus,
    isUploaded: boolean,
  ): Promise<boolean> {
    const update = await this.update({ uuid }, { status, isUploaded });
    return update.affected > 0 ? true : false;
  }

  /**
   * update isArchived by uuid
   */
  async updateIsArchivedByUuid(
    uuid: string,
    isArchived: boolean,
  ): Promise<boolean> {
    const update = await this.update({ uuid }, { isArchived });
    return update.affected > 0 ? true : false;
  }

  /**
   * Fetch all entities with the given status and before the given date
   */
  async fetchByStatusAndBeforeArchivalDateTime(
    status: FileStatus,
    dateTime: Date,
  ): Promise<File[]> {
    return await this.find({
      where: {
        status,
        archivalDate: LessThanOrEqual(dateTime),
      },
    });
  }
}
