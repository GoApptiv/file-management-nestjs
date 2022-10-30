import { Injectable } from '@nestjs/common';
import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { DataSource, LessThanOrEqual, Repository } from 'typeorm';
import { StoreFileVariantDAO } from '../dao/file-variant.dao';
import { FileVariant } from '../entities/file-variant.entity';

@Injectable()
export class FileVariantRepository extends Repository<FileVariant> {
  constructor(dataSource: DataSource) {
    super(FileVariant, dataSource.manager);
  }

  /**
   * Finds entity which matches the id
   */
  findById(
    id: number,
    relations?: (keyof FileVariant)[] | string[],
  ): Promise<FileVariant> {
    return this.findOne({ where: { id }, relations: relations });
  }

  /**
   * Fetch entity which matches the file id
   */
  fetchByFileIdAndStatus(
    fileId: number,
    status: FileVariantStatus,
    relations?: (keyof FileVariant)[] | string[],
  ): Promise<FileVariant[]> {
    return this.find({ where: { fileId, status }, relations: relations });
  }

  /**
   * Creates new record
   */
  store(data: StoreFileVariantDAO): Promise<FileVariant> {
    return this.save(data);
  }

  /**
   * Updates the status by id
   */
  async updateStatusById(
    id: number,
    status: FileVariantStatus,
  ): Promise<boolean> {
    const update = await this.update({ id }, { status });
    return update.affected > 0 ? true : false;
  }

  /**
   * Fetch entity which matches the fileId and pluginId
   */
  fetchByFileIdAndPluginId(
    fileId: number,
    pluginId: number,
    relations?: (keyof FileVariant)[] | string[],
  ): Promise<FileVariant[]> {
    return this.find({
      where: { fileId, pluginId },
      relations: relations,
    });
  }

  /**
   * update the status and storagePath by id
   */
  async updateStatusAndStoragePathById(
    id: number,
    status: FileVariantStatus,
    storagePath: string,
  ): Promise<boolean> {
    const update = await this.update({ id }, { status, storagePath });
    return update.affected > 0 ? true : false;
  }

  /**
   * Fetch all entities with the given status and before the given date
   */
  fetchByStatusAndBeforeDateTime(
    status: FileVariantStatus,
    dateTime: Date,
  ): Promise<FileVariant[]> {
    return this.find({
      where: {
        status,
        createdAt: LessThanOrEqual(dateTime),
      },
    });
  }
}
