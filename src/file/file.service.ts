import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { resolve, join } from 'path';
import { v4 } from 'uuid';
import { URL } from 'url';

@Injectable()
export class FileService {
  constructor() {}

  uploadFile(file: Express.Multer.File): string {
    const fileName = `${v4()}.${file.originalname.split('.').pop()}`;
    const path = join(resolve(), '/static/', fileName);
    fs.writeFileSync(path, file.buffer);
    return new URL(fileName, process.env.BACK_BASE_URL).toString();
  }

  deleteFile(link: string): void {
    const path = join(resolve(), '/static/', new URL(link).pathname);
    fs.unlinkSync(path);
  }
}
