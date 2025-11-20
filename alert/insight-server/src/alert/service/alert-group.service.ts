import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AlarmGroup, AlarmGroupDocument } from '../schemas/alarm-group.schema';

@Injectable()
export class AlertGroupService {
  constructor(
    @InjectModel(AlarmGroup.name)
    private readonly alarmGroupModel: Model<AlarmGroupDocument>,
  ) {}

  async getAlarmGroups(): Promise<AlarmGroupDocument[]> {
    const groups = await this.alarmGroupModel.find().sort({ createdAt: -1 }).exec();
    return groups || [];
  }

  async createAlarmGroup(name: string): Promise<AlarmGroup> {
    const exists = await this.alarmGroupModel.findOne({ name });
    if (exists) {
      throw new Error('名称已存在');
    }
    return this.alarmGroupModel.create({ name });
  }

  async deleteAlarmGroup(_id: string): Promise<void> {
    await this.alarmGroupModel.findByIdAndDelete(_id);
  }

  async updateAlarmGroup(_id: string, name: string): Promise<AlarmGroup | null> {
    const exists = await this.alarmGroupModel.findOne({ name, _id: { $ne: _id } });
    if (exists) {
      throw new Error('名称已存在');
    }

    return this.alarmGroupModel.findByIdAndUpdate(
      _id,
      { name },
      { new: true }, // 返回更新后的文档
    );
  }
}
