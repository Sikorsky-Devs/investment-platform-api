import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../../database/prisma.service';
import { ProjectWithProductEntity } from './entity/project-with-product.entity';
import { FindProjectsDto } from './dto/find-projects.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

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
            investments: {
              createMany: {
                data: p.investments,
              },
            },
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
}
