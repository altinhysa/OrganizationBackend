import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, Body } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppModule } from 'src/app.module';
import { CreateOrganizationDto } from 'src/organizations/dto/create-organization.dto';

describe('Organizations (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    const httpAdapter = app.getHttpAdapter();
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /organizations', () => {
    it('should return a list of organizations', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/organizations')
        .auth('4', '')
        .expect(200);

      expect(body.length).toBe(6);
    });
  });

  describe('GET /organizations/:id', () => {
    it('should return the correct organization', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/organizations/2')
        .auth('4', '')
        .expect(200);

      expect(body).toHaveProperty('id', 2);
    });

    it('should return not found on bad id', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/organizations/1')
        .auth('4', '')
        .expect(404);

      expect(body).toStrictEqual({
        message: '[P2025]: No Organization found',
        statusCode: 404,
      });
    });
  });

  describe('POST /organizations', () => {
    it('should create an organization', async () => {
      const createOrganizationDto: CreateOrganizationDto = {
        name: 'Test',
      };

      await request(app.getHttpServer())
        .post('/organizations')
        .auth('4', '')
        .send(createOrganizationDto)
        .expect(201);
    });
    it('should throw bad request when name isnt valid', async () => {
      const createOrganizationDto: CreateOrganizationDto = {
        name: '',
      };

      await request(app.getHttpServer())
        .post('/organizations')
        .auth('4', '')
        .send(createOrganizationDto)
        .expect(400);
    });
  });
});
