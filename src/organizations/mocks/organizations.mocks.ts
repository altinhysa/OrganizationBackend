import { Role } from '@prisma/client';

export const organizationStub = {
  id: 1,
  name: 'Company 1',
  employees: [
    { id: 1, name: 'Employee 1', email: 'emp1@gmail.com', role: Role.USER },
    { id: 2, name: 'Employee 2', email: 'emp2@gmail.com', role: Role.USER },
  ],
  logo: 'company1.png',
};

export const organizationWithoutEmployees = {
  id: 1,
  name: 'Company 2',
  logo: 'company2.png',
};

export const organizationsStub = [
  {
    _count: {
      employees: 5,
    },
    id: 1,
    name: 'Company 1',
    logo: 'company1.png',
  },
  {
    _count: {
      employees: 31,
    },
    id: 2,
    name: 'Company 2',
    logo: 'company2.png',
  },
];

export const prisma = {
  organization: {
    findMany: jest.fn().mockResolvedValue(organizationsStub),
    findUnique: jest.fn().mockResolvedValue(organizationStub),
    create: jest.fn().mockResolvedValue(organizationWithoutEmployees),
    update: jest.fn().mockResolvedValue(organizationWithoutEmployees),
    findUniqueOrThrow: jest.fn().mockResolvedValue(organizationStub),
    delete: jest.fn().mockResolvedValue(organizationWithoutEmployees),
  },
};
