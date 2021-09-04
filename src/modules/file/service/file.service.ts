import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  getHello(): string {
    return 'Hello World!';
  }
}
