import { Controller, Get, Post, Body } from '@nestjs/common';
import { AlertGroupService } from '../service/alert-group.service';
import { AuthRoleEnum } from 'src/auth/constants/user.constant';
import { Roles } from 'src/auth/roles.decorator';

@Controller('alert-group')
export class AlertGroupController {
  constructor(private readonly alertGroupService: AlertGroupService) {}

  // 获取告警组
  @Get('list')
  async getAll() {
    return this.alertGroupService.getAlarmGroups();
  }

  // 新增或编辑
  @Post('save')
  @Roles(AuthRoleEnum.ADMIN, AuthRoleEnum.SUPER_ADMIN)
  async createOrUpdate(@Body() body: { _id?: string; name: string }) {
    const { _id, name } = body;
    if (_id) {
      return this.alertGroupService.updateAlarmGroup(_id, name);
    } else {
      return this.alertGroupService.createAlarmGroup(name);
    }
  }

  // 删除
  @Post('delete')
  @Roles(AuthRoleEnum.ADMIN, AuthRoleEnum.SUPER_ADMIN)
  async delete(@Body() body: { _id?: string }) {
    const { _id } = body;
    return this.alertGroupService.deleteAlarmGroup(_id);
  }
}
