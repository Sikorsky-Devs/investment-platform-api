import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProjectWithProductEntity } from './entity/project-with-product.entity';
import { FindProjectsDto } from './dto/find-projects.dto';

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
}
