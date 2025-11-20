import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AlertDocument = Alert & Document;

@Schema({ collection: 'alert' })
export class Alert {
  @Prop({ required: true, default: '' }) _id: string;

  @Prop({ required: true, default: '' }) alertId: string;

  @Prop({ required: true, default: [] }) kunlunId: string[];

  @Prop({ required: true, default: '' }) alarmGroup: string;

  @Prop({ default: Date.now }) createTime: number;

  @Prop() updateTime: number;

  @Prop() insightUpdateTime: number;

  @Prop() appKey: string;

  @Prop() source: string;

  @Prop() indicator: string;

  @Prop() monitorKey: string;

  @Prop() metricTagKey: string;

  @Prop() tenant: string;

  @Prop({ type: Object }) tagMap: Record<string, string>;

  @Prop() message: string;

  @Prop() level: string;

  @Prop() aggId: string;

  @Prop() aggSpan: string | null;

  @Prop() aggKey: string;

  @Prop() directSendAlarm: boolean;

  @Prop({ type: Object }) alertStrategy: Record<string, any>;

  @Prop() dataTime: number;

  @Prop() receiveTime: number;

  @Prop() alarmStatus: string | null;

  @Prop() alarmDetail: string | null;

  @Prop() sendAlarmTime: number;

  @Prop() firstDirector: string;

  @Prop({ type: [String] }) directorList: string[];

  @Prop({ type: [String] }) subscriberGroups: string[];

  @Prop({ type: [String] }) teamsSendList: string[];

  @Prop({ type: [String] }) smsSendList: string[];

  @Prop({ type: [String] }) mobileSendList: string[];

  @Prop() alarmIsClosed: boolean;

  @Prop() alertMsg: string;

  // 源连接
  @Prop({
    type: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    default: [],
  })
  teamsHrefData: { name: string; url: string }[];

  // 状态
  @Prop() status: string;

  // 备注
  @Prop() remark: string;

  // 操作人
  @Prop({
    type: [
      {
        email: { type: String, required: true, default: '' },
        time: { type: Number, required: true, default: 0 },
        status: { type: String, required: true, default: '' },
        remark: { type: String },
      },
    ],
    default: [],
  })
  operator: {
    email: string;
    time: number;
    status: string;
    remark?: string;
  }[];

  // 响应数据
  @Prop({
    type: {
      email: { type: String, required: true, default: '' },
      time: { type: Number, required: true, default: 0 },
    },
    default: {},
  })
  viewData: {
    email: string;
    time: number;
  };

  // 处理完成数据
  @Prop({
    type: {
      email: { type: String, required: true, default: '' },
      time: { type: Number, required: true, default: 0 },
    },
    default: {},
  })
  finishData: {
    email: string;
    time: number;
  };
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
