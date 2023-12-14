import { ApiProperty } from '@nestjs/swagger';

export class OrganizationListDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  employeeCount: number;
}
