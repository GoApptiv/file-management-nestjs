import { FileVariantStatus } from 'src/shared/constants/file-variant-status.enum';
import { LessThanOrEqual, Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { FileVariantDAO } from '../dao/file-variant.dao';
import { FileVariant } from '../entities/file-variant.entity';

@EntityRepository(FileVariant)
export class FileVariantRepository extends Repository<FileVariant> {
  /**
   * Finds entity which matches the id
   */
  async findById(
    id: number,
    relations?: (keyof FileVariant)[] | string[],
  ): Promise<FileVariant> {
    return await this.findOne({ where: { id }, relations: relations });
  }

  /**
   * Fetch entity which matches the file id
   */
  async fetchByFileIdAndStatus(
    fileId: number,
    status: FileVariantStatus,
    relations?: (keyof FileVariant)[] | string[],
  ): Promise<FileVariant[]> {
    return await this.find({ where: { fileId, status }, relations: relations });
  }

  /**
   * Creates new record
   */
  async store(data: FileVariantDAO): Promise<FileVariant> {
    return await this.save(data);
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
  async fetchByFileIdAndPluginId(
    fileId: number,
    pluginId: number,
    relations?: (keyof FileVariant)[] | string[],
  ): Promise<FileVariant[]> {
    return await this.find({
      where: { fileId, pluginId },
      relations: relations,
    });
  }

  /**
   * Updates the data by id
   */
  async updateById(id: number, data: FileVariantDAO): Promise<boolean> {
    const update = await this.update({ id }, data);
    return update.affected > 0 ? true : false;
  }

  /**
   * Fetch all entities with the given status and before the given date
   */
  async fetchByStatusAndBeforeDateTime(
    status: FileVariantStatus,
    dateTime: Date,
  ): Promise<FileVariant[]> {
    return await this.find({
      where: {
        status,
        createdAt: LessThanOrEqual(dateTime),
      },
    });
  }
}
