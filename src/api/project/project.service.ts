import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../../database/prisma.service';
import { ProjectWithProductEntity } from './entity/project-with-product.entity';

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
}
