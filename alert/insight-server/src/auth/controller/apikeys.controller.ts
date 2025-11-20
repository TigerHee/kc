import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiKeysService } from '../services/apikeys.service';
import { CreateAuthApiKeysDto } from '../dto/create-auth-apikeys.dto';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth.types';
import { Roles } from '../roles.decorator';
import { AuthRoleEnum } from '../constants/user.constant';

@Controller('apikeys')
export class ApiKeysController {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly jwtService: JwtService,
  ) {
    //
  }

  @Get('')
  @Roles(AuthRoleEnum.ADMIN)
  async list() {
    return this.apiKeysService.list();
  }

  @Post('')
  @Roles(AuthRoleEnum.ADMIN)
  async create(@Body() body: CreateAuthApiKeysDto, @Req() req: RequestWithUser) {
    const { remark, data, duration } = body;
    const _data = { ...data };
    const secret = this.jwtService.sign(_data, {
      expiresIn: duration,
    });
    await this.apiKeysService.createOne({ remark, secret, duration, owner: req.user.id });
  }

  @Delete(':id')
  @Roles(AuthRoleEnum.ADMIN)
  async delete(@Param('id') id: string) {
    await this.apiKeysService.deleteOne(id);
  }

  @Put('disabled/:id')
  @Roles(AuthRoleEnum.ADMIN)
  async disabled(@Param('id') id: string) {
    await this.apiKeysService.disabledOne(id);
  }
}
