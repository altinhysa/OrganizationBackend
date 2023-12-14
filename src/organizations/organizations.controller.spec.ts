import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let service: OrganizationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [OrganizationsService, PrismaService],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
    prismaService = module.get<PrismaService>(PrismaService);
    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the organization with the correct id ', () => {
      expect(controller.findOne(2)).resolves.toHaveProperty('id', 2);
    });
  });

  describe('add', () => {
    it('should add a new organization', async () => {
      const organizationDto: CreateOrganizationDto = {
        name: 'Povio',
      };

      const newOrganization = await controller.create(organizationDto);
      expect(controller.findOne(newOrganization.id)).resolves.toHaveProperty(
        'name',
        'Povio',
      );
    });
  });

  describe('getEmployees', () => {
    it('should return the correct length', async () => {
      const organization = await controller.getEmployeesFromAnOrganization(2);
      expect(organization.length).toBe(2);
    });
  });
});
