import { Prisma } from '@prisma/client';
export type OrganizationWithEmployees = Prisma.OrganizationGetPayload<{
  include: { employees: true };
}>;
