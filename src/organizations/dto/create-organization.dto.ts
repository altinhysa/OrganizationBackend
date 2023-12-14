import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  logo?: string;
}
