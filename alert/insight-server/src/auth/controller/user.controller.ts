import { RequestWithUser } from '../auth.types';
import { SyncUserDto } from '../dto/sync-user.dto';
import { UserDocument } from '../schemas/user.schema';
import { UserService } from '../services/user.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
    //
  }

  @Get('info')
  async getUserInfo(@Req() req: RequestWithUser) {
    try {
      if (req.user?.email) {
        const user = await this.userService.getUserByEmail(req.user.email);
        return user;
      } else if (req.user) {
        return req.user;
      }
    } catch (error) {
      throw new UnauthorizedException('用户信息获取失败:' + error.message);
    }
  }

  @Get('options')
  async getUserOptions() {
    const data = await this.userService.getUserOptions();
    return data;
  }

  @Get('prRejectRecord')
  async getPrRejectRecord(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('user') user: string,
  ) {
    return await this.userService.getPrRejectRecord({ current, pageSize, user });
  }

  @Post('sync')
  async syncUser(@Body() body: SyncUserDto) {
    return await this.userService.syncUser(body);
  }

  @Get('')
  async getAllUsers(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Query('email') email: string,
    @Query('role') role: string,
    @Query('prAuthStatus') prAuthStatus: 'true' | 'false' | undefined,
    @Query('readStatus') readStatus: 'success' | 'warning' | 'error',
  ) {
    return await this.userService.getAllUsers({
      current,
      pageSize,
      name,
      email,
      role,
      phone,
      readStatus,
      prAuthStatus,
    });
  }

  @Post('')
  async createUser(@Body() body: Pick<UserDocument, 'name' | 'email' | 'phone' | 'role'>) {
    return await this.userService.createUser(body);
  }

  @Put('')
  async updateUserBySelf(
    @Req() req: RequestWithUser,
    @Body('phone') phone: string,
    @Body('terminalPassword') terminalPassword: string,
  ) {
    const id = req.user.id;
    const res = await this.userService.updateUser(id, { phone, terminalPassword }, req.user);
    return res;
  }

  @Get(':id/action-logs')
  async getUserActionLogs(@Param('id') id: string) {
    return await this.userService.getUserActionLogs(id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: Pick<UserDocument, 'name' | 'email' | 'phone' | 'avatar' | 'role'>,
  ) {
    const res = await this.userService.updateUser(id, body, req.user);
    return res;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
