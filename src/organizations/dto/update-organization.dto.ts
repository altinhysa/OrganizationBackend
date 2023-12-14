import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import { PickType } from '@nestjs/swagger';

export class UpdateOrganizationDto extends PickType(CreateOrganizationDto, [
  'name',
] as const) {}
