import type { AbstractEntity } from '../entities/abstract.entity';

export class BaseDto {
  id: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
