import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname, join } from 'path';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { ConnectEmployeeDto } from './dto/connect-employee.dto';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OrganizationDto } from './dto/organization.dto';
import { OrganizationListDto } from './dto/organization.list.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { ApiFileBody } from 'src/shared/decorators/api-file-body.decorator';

@ApiBasicAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('organizations')
@ApiTags('organizations')
@ApiUnauthorizedResponse({ description: 'Not authorized' })
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiCreatedResponse({ type: OrganizationDto })
  @ApiBadRequestResponse()
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  @ApiOkResponse({ type: [OrganizationListDto] })
  findAll(@Query('name') name: string) {
    return this.organizationsService.findAll(name);
  }

  @Get(':id')
  @ApiOkResponse({ type: OrganizationDto })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: OrganizationDto })
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.remove(id);
  }

  @Post('/:id/employees')
  @ApiOkResponse({ type: OrganizationDto })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Employee already in organization' })
  addEmployeeToOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Body() employee: ConnectEmployeeDto,
  ) {
    return this.organizationsService.addUserToOrganization(
      id,
      +employee.userId,
    );
  }

  @Get('/:id/employees')
  @ApiOkResponse({ type: [UserDto] })
  getEmployeesFromAnOrganization(@Param('id', ParseIntPipe) id: number) {
    return this.organizationsService.getEmployeesfromOrganizationId(id);
  }

  @Delete('/:id/employees/:userId')
  removeEmployeeFromOrganization(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    this.organizationsService.deleteUserFromOrganization(id, userId);
  }

  @Post('/:id/logo')
  @ApiConsumes('multipart/form-data')
  @ApiFileBody()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './logos',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          const fileName = uniqueName + extension;
          callback(null, fileName);
        },
      }),
    }),
  )
  addLogoToOrganization(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.organizationsService.addLogoToOrganization(id, file.filename);
  }

  @Get('/:id/logo')
  async getLogo(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const logo = await this.organizationsService.getLogoFromOrganization(id);
    res.sendFile(logo, { root: 'logos' });
  }
}
