import { Photo } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoEntity implements Photo {
  @ApiProperty()
  id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  isMain: boolean;
}
