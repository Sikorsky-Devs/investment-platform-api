import { Body, Controller, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProjectWithProductEntity } from './entity/project-with-product.entity';

@Controller('Project')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOkResponse({ type: ProjectWithProductEntity })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }
}
