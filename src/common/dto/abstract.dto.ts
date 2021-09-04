import type { AbstractEntity } from '../entity/abstract.entity';

export class BaseDto {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
