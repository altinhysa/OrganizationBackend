import { OrganizationDto } from './dto/organization.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationListDto } from './dto/organization.list.dto';
import { UserDto } from 'src/user/dtos/user.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prismaService: PrismaService) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const organization = await this.prismaService.organization.create({
      data: createOrganizationDto,
    });

    return OrganizationDto.fromEntity(organization);
  }

  async findAll(name: string) {
    const organizations = await this.prismaService.organization.findMany({
      include: {
        _count: {
          select: { employees: true },
        },
      },
      where: {
        name: {
          contains: name,
        },
      },
    });

    const organizationDto: OrganizationListDto[] = organizations.map(
      (organization) => ({
        id: organization.id,
        employeeCount: organization._count.employees,
        name: organization.name,
        logo: organization.logo,
      }),
    );

    return organizationDto;
  }

  async findOne(id: number) {
    const organization =
      await this.prismaService.organization.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          employees: true,
        },
      });
    return OrganizationDto.fromEntityWithEmployees(organization);
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const updatedOrganizaton = await this.prismaService.organization.update({
      where: {
        id: id,
      },
      data: updateOrganizationDto,
    });
    return OrganizationDto.fromEntity(updatedOrganizaton);
  }

  async remove(id: number) {
    return await this.prismaService.organization.delete({
      where: {
        id: id,
      },
    });
  }

  async getEmployeesfromOrganizationId(id: number) {
    const organization =
      await this.prismaService.organization.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          employees: true,
        },
      });

    return organization.employees.map((employee) =>
      UserDto.fromEntity(employee),
    );
  }

  async addUserToOrganization(id: number, userId: number) {
    const existsOrganization = await this.prismaService.organization.findUnique(
      {
        where: {
          id: id,
          employees: {
            some: {
              id: userId,
            },
          },
        },
        include: {
          employees: true,
        },
      },
    );

    if (existsOrganization) {
      throw new ConflictException('Employee already in organization');
    }

    const organization = await this.prismaService.organization.update({
      where: {
        id: id,
      },
      data: {
        employees: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        employees: true,
      },
    });

    return OrganizationDto.fromEntityWithEmployees(organization);
  }

  async deleteUserFromOrganization(id: number, userId: number) {
    return await this.prismaService.organization.update({
      where: {
        id: id,
      },
      data: {
        employees: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async addLogoToOrganization(id: number, fileName: string) {
    const updatedOrganizaton = await this.prismaService.organization.update({
      where: {
        id: id,
      },
      data: {
        logo: fileName,
      },
    });

    return OrganizationDto.fromEntity(updatedOrganizaton);
  }

  async getLogoFromOrganization(id: number) {
    const organization =
      await this.prismaService.organization.findUniqueOrThrow({
        where: {
          id: id,
        },
        select: {
          logo: true,
        },
      });

    if (!organization.logo) {
      throw new NotFoundException('Organization has no logo');
    }

    return organization.logo;
  }
}
