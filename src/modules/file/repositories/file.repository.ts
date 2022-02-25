import { In, Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { FileDAO } from '../dao/file.dao';
import { File } from '../entities/file.entity';

@EntityRepository(File)
export class FileRepository extends Repository<File> {
  /**
   * Creates new record
   */
  async store(data: FileDAO): Promise<File> {
    return await this.save(data);
  }

  /**
   * Finds entity which matches the uuid
   */
  async findByUuid(uuid: string, relations?: string[]): Promise<File> {
    return await this.findOne({ where: { uuid }, relations: relations });
  }

  /**
   * Finds entity which matches the uuid and projectId
   */
  async findByUuidAndProjectId(
    uuid: string,
    projectId: number,
    relations?: string[],
  ): Promise<File> {
    return await this.findOne({
      where: { uuid, projectId },
      relations: relations,
    });
  }

  /**
   * Fetch entity which matches the uuids
   */
  async fetchByUuids(uuids: [], relations?: string[]): Promise<File[]> {
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
    relations?: string[],
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
   * Updates the data by uuid
   */
  async updateByUuid(uuid: string, data: FileDAO): Promise<boolean> {
    const update = await this.update({ uuid }, data);
    return update.affected > 0 ? true : false;
  }
}
