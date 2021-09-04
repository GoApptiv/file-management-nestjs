import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Project } from '../entity/project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {}
