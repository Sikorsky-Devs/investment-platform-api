import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../../database/prisma.service';
import { ProjectWithProductEntity } from './entity/project-with-product.entity';
import { FindProjectsDto } from './dto/find-projects.dto';
import { Prisma } from '@prisma/client';
import { FileService } from '../../file/file.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectWithProductEntity> {
    const { photos, product, ...rest } = createProjectDto;

    return this.prismaService.project.create({
      data: {
        ...rest,

        photos: {
          createMany: {
            data: photos,
          },
        },

        products: {
          create: product.map((p) => ({
            name: p.name,
            amount: p.amount,
          })),
        },
      },
      include: {
        photos: true,
        products: {
          include: { investments: true },
        },
      },
    });
  }

  getProjectById(projectId: string): Promise<ProjectWithProductEntity> {
    return this.prismaService.project.findFirst({
      where: {
        id: projectId,
      },
      include: {
        photos: true,
        products: {
          include: { investments: true },
        },
      },
    });
  }

  getAllProjects(
    findProjectDto: FindProjectsDto,
  ): Promise<ProjectWithProductEntity[]> {
    const { search, currencyType, projectType, minCost, maxCost, userId } =
      findProjectDto;

    const where: Prisma.ProjectWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (currencyType) where.currencyType = currencyType;
    if (projectType) where.projectType = projectType;
    if (userId) where.userId = userId;

    if (minCost != null || maxCost != null) {
      where.estimatedCost = {
        ...(minCost != null ? { gte: minCost } : {}),
        ...(maxCost != null ? { lte: maxCost } : {}),
      };
    }

    return this.prismaService.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        photos: true,
        products: {
          include: { investments: true },
        },
      },
    });
  }

  async uploadPhotos(
    files: Express.Multer.File[],
    projectId: string,
    userId: string,
  ): Promise<string[]> {
    const project = await this.prismaService.project.findFirst({
      where: { id: projectId, userId },
    });
    if (!project) {
      throw new NotFoundException(
        `Project with id ${projectId} not found for this user`,
      );
    }

    const fileLinks: string[] = [];
    for (const file of files) {
      const link = this.fileService.uploadFile(file);
      fileLinks.push(link);
    }
    const photosData = fileLinks.map((link, index) => ({
      projectId,
      link,
      isMain: index === 0,
    }));
    await this.prismaService.photo.createMany({
      data: photosData,
    });
    return fileLinks;
  }
}
