import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProjectWithProductEntity } from './entity/project-with-product.entity';
import { FindProjectsDto } from './dto/find-projects.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('project')
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOkResponse({ type: ProjectWithProductEntity })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @ApiOkResponse({ type: [ProjectWithProductEntity] })
  @Get()
  async getProjects(@Query() findProjectsDto: FindProjectsDto) {
    return this.projectService.getAllProjects(findProjectsDto);
  }

  @Post('/:projectId/photos/upload')
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('files'))
  uploadPhotos(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('projectId') projectId: string,
    @Req() req: Request,
  ) {
    return this.projectService.uploadPhotos(files, projectId, req['user'].id);
  }

  @ApiOkResponse({ type: ProjectWithProductEntity })
  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }
}
