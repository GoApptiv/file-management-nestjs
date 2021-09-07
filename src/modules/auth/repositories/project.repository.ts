import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';
import { Project } from '../entities/project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {}
