import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs';
import { join, resolve } from 'path';
import { v4, v4 as uuidv4 } from 'uuid';
import { URL } from 'url';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { spawn } from 'child_process';
import { tmpdir } from 'os';

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

  fillTemplate(fileName: string, data: object) {
    const path = join(resolve(), '/static/', fileName);
    const zip = new PizZip(fs.readFileSync(path, 'binary'));

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => '',
    });

    doc.render(data);
    return doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
  }

  async convertDocxBufferToPdfBuffer(docxBuffer: Buffer): Promise<Buffer> {
    const tempDir = tmpdir();
    const id = uuidv4();
    const tempDocxPath = join(tempDir, `${id}.docx`);
    const tempPdfPath = join(tempDir, `${id}.pdf`);

    try {
      fs.writeFileSync(tempDocxPath, docxBuffer);

      await new Promise<void>((resolve, reject) => {
        const convert = spawn('unoconv', ['-f', 'pdf', tempDocxPath]);

        convert.stdout.on('data', (data) =>
          console.log('stdout:', data.toString()),
        );
        convert.stderr.on('data', (data) =>
          console.error('stderr:', data.toString()),
        );

        convert.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`unoconv exited with code ${code}`));
        });
      });

      return fs.readFileSync(tempPdfPath);
    } finally {
      await Promise.allSettled([
        fs.promises.unlink(tempDocxPath),
        fs.promises.unlink(tempPdfPath),
      ]);
    }
  }
}
