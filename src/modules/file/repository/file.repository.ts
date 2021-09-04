import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { File } from '../entity/file.entity';

@EntityRepository(File)
export class FileRepository extends Repository<File> {}
