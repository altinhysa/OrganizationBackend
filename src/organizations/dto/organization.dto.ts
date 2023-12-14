import { UserDto } from 'src/user/dtos/user.dto';
import { OrganizationWithEmployees } from '../types/organization.type';
import { Organization } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class OrganizationDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: [UserDto] })
  employees?: UserDto[];
  @ApiProperty()
  logo?: string;

  static fromEntityWithEmployees(entity: OrganizationWithEmployees) {
    return {
      id: entity.id,
      name: entity.name,
      logo: entity.logo,
      employees: entity.employees,
    };
  }
  static fromEntity(entity: Organization) {
    return {
      id: entity.id,
      name: entity.name,
      logo: entity.logo,
    };
  }
}
