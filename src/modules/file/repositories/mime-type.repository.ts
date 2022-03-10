import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { MimeType } from '../entities/mime-type.entity';

@EntityRepository(MimeType)
export class MimeTypeRepository extends Repository<MimeType> {
  /**
   * Finds entity which matches the type
   */
  async findByType(
    type: string,
    relations?: (keyof MimeType)[] | string[],
  ): Promise<MimeType> {
    return await this.findOne({ where: { type }, relations: relations });
  }
}
