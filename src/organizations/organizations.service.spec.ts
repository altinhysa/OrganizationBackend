import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { OrganizationListDto } from './dto/organization.list.dto';
import { OrganizationDto } from './dto/organization.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  organizationStub,
  organizationWithoutEmployees,
  organizationsStub,
  prisma,
} from './mocks/organizations.mocks';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('organizations service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    let organizations: OrganizationListDto[];
    beforeEach(async () => {
      organizations = await service.findAll('');
    });

    it('should call the findMany method on prismaService', () => {
      expect(prismaService.organization.findMany).toHaveBeenCalled();
    });

    it('should return the correct length of organizations', async () => {
      expect(organizations.length).toEqual(organizationsStub.length);
    });
  });

  describe('findAll(name)', () => {
    let organizations: OrganizationListDto[];

    beforeEach(async () => {
      organizations = await service.findAll('povio');
    });

    it('should call the prismaService with where: {name}', () => {
      expect(prismaService.organization.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: { employees: true },
          },
        },
        where: {
          name: {
            contains: 'povio',
          },
        },
      });
    });
  });

  describe('findOne', () => {
    let organization: OrganizationDto;

    beforeEach(async () => {
      organization = await service.findOne(1);
    });

    it('should call prisma service findUnique with id', () => {
      expect(prismaService.organization.findUniqueOrThrow).toHaveBeenCalledWith(
        {
          where: {
            id: organization.id,
          },
          include: {
            employees: true,
          },
        },
      );
    });

    it('should return a single organization', async () => {
      expect(organization).toStrictEqual(organizationStub);
    });

    it('should throw an error with bad id', async () => {
      jest
        .spyOn(prisma.organization, 'findUniqueOrThrow')
        .mockRejectedValueOnce(new NotFoundException());

      expect(service.findOne(4)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEmployeesFromAnOrganization', () => {
    it('should return an array of employees', async () => {
      expect(service.getEmployeesfromOrganizationId(2)).resolves.toStrictEqual(
        organizationStub.employees,
      );
    });
  });

  describe('getLogo', () => {
    it('should return the logo', async () => {
      expect(service.getLogoFromOrganization(2)).resolves.toEqual(
        organizationStub.logo,
      );
    });

    it('should throw an error when no logo is found', async () => {
      jest
        .spyOn(prisma.organization, 'findUniqueOrThrow')
        .mockResolvedValueOnce({
          logo: null,
        });

      expect(service.getLogoFromOrganization(2)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    let organization: OrganizationDto;
    let createOrganizationDto: CreateOrganizationDto;

    beforeEach(async () => {
      createOrganizationDto = {
        name: 'Company 2',
      };
      organization = await service.create(createOrganizationDto);
    });

    it('should call prismaService create with the correct data', () => {
      expect(prismaService.organization.create).toHaveBeenCalledWith({
        data: createOrganizationDto,
      });
    });

    it('should return an organization', () => {
      expect(organization).toEqual(organizationWithoutEmployees);
    });
  });

  describe('update', () => {
    let organization: OrganizationDto;
    let updateOrganizationDto: UpdateOrganizationDto;

    beforeEach(async () => {
      updateOrganizationDto = {
        name: 'Company 2',
      };

      organization = await service.update(1, updateOrganizationDto);
    });

    it('should call prismaService update with given criteria', () => {
      expect(prismaService.organization.update).toHaveBeenCalledWith({
        where: {
          id: organization.id,
        },
        data: updateOrganizationDto,
      });
    });

    it('should return an organizationStub', () => {
      expect(organization).toEqual(organizationWithoutEmployees);
    });
  });

  describe('delete', () => {
    let organization: OrganizationDto;

    beforeEach(async () => {
      organization = await service.remove(1);
    });

    it('should call prismaService delete with id ', () => {
      expect(prismaService.organization.delete).toHaveBeenCalledWith({
        where: {
          id: organization.id,
        },
      });
    });

    it('should return the deleted organization', () => {
      expect(organization).toEqual(organizationWithoutEmployees);
    });
  });

  describe('addUserToOrganization', () => {
    describe('when user exists in organization', () => {
      it('it should throw conflict error', () => {
        expect(service.addUserToOrganization(1, 2)).rejects.toThrow(
          ConflictException,
        );
      });
    });

    describe('when user doesnt exist in organization', () => {
      let organization: OrganizationDto;

      beforeEach(async () => {
        jest
          .spyOn(prisma.organization, 'findUnique')
          .mockResolvedValueOnce(undefined);
        jest
          .spyOn(prisma.organization, 'update')
          .mockResolvedValueOnce(organizationStub);
        organization = await service.addUserToOrganization(1, 2);
      });

      it('it should call the prisma service findUnique with the given criteria', () => {
        expect(prismaService.organization.findUnique).toHaveBeenCalledWith({
          where: {
            id: organization.id,
            employees: {
              some: {
                id: 2,
              },
            },
          },
          include: {
            employees: true,
          },
        });
      });

      it('it should call the prisma service update with the given criteria', () => {
        expect(prismaService.organization.update).toHaveBeenCalledWith({
          where: {
            id: organization.id,
          },
          data: {
            employees: {
              connect: {
                id: 2,
              },
            },
          },
          include: {
            employees: true,
          },
        });
      });

      it('it should return the organization', () => {
        expect(organization).toEqual(organizationStub);
      });
    });
  });

  describe('deleteUserFromOrganization', () => {
    let organization: OrganizationDto;

    beforeEach(async () => {
      organization = await service.deleteUserFromOrganization(
        organizationStub.id,
        2,
      );
    });

    it('it should call prismaService update with the given criteria', () => {
      expect(prismaService.organization.update).toHaveBeenCalledWith({
        where: {
          id: organization.id,
        },
        data: {
          employees: {
            disconnect: {
              id: 2,
            },
          },
        },
      });
    });
  });

  describe('addLogoToOrganization', () => {
    let organization: OrganizationDto;

    beforeEach(async () => {
      organization = await service.addLogoToOrganization(
        organizationWithoutEmployees.id,
        organizationWithoutEmployees.logo,
      );
    });

    it('it should call the prisma Service update', () => {
      expect(prismaService.organization.update).toHaveBeenCalledWith({
        where: {
          id: organization.id,
        },
        data: {
          logo: organization.logo,
        },
      });
    });

    it('should return the correct organization', () => {
      expect(organization).toEqual(organizationWithoutEmployees);
    });
  });
});
