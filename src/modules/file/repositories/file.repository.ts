import { Injectable } from '@nestjs/common';
import { FileStatus } from 'src/shared/constants/file-status.enum';
import { DataSource, In, LessThanOrEqual, Repository } from 'typeorm';
import { StoreFileDAO } from '../dao/file.dao';
import { File } from '../entities/file.entity';

@Injectable()
export class FileRepository extends Repository<File> {
  constructor(dataSource: DataSource) {
    super(File, dataSource.manager);
  }

  /**
   * Creates new record
   */
  store(data: StoreFileDAO): Promise<File> {
    return this.save(data);
  }

  /**
   * Finds entity which matches the uuid
   */
  findByUuid(
    uuid: string,
    relations?: (keyof File)[] | string[],
  ): Promise<File> {
    return this.findOne({ where: { uuid }, relations: relations });
  }

  /**
   * Finds entity which matches the uuid and projectId
   */
  findByUuidAndProjectId(
    uuid: string,
    projectId: number,
    relations?: (keyof File)[] | string[],
  ): Promise<File> {
    return this.findOne({
      where: { uuid, projectId },
      relations: relations,
    });
  }

  /**
   * Fetch entity which matches the uuids
   */
  fetchByUuids(
    uuids: [],
    relations?: (keyof File)[] | string[],
  ): Promise<File[]> {
    return this.find({
      where: {
        uuid: In(uuids),
      },
      relations: relations,
    });
  }

  /**
   * Fetch entity which matches the uuids and projectId
   */
  fetchByUuidsAndProjectId(
    uuids: [],
    projectId: number,
    relations?: (keyof File)[] | string[],
  ): Promise<File[]> {
    return this.find({
      where: {
        uuid: In(uuids),
        projectId,
      },
      relations: relations,
    });
  }

  /**
   * Update the status and isUploaded by uuid
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
   * Update isArchived by uuid
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
  fetchByStatusAndBeforeArchivalDateTimeAndIsArchivedStatus(
    status: FileStatus,
    dateTime: Date,
    isArchived: boolean,
    limit: number,
  ): Promise<File[]> {
    return this.find({
      where: {
        status,
        isArchived,
        archivalDate: LessThanOrEqual(dateTime),
      },
      take: limit,
    });
  }
}
