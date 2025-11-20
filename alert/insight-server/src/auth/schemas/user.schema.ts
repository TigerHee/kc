import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { AuthRoleEnum } from '../constants/user.constant';
import { UserLog } from './user-log.schema';

type UserDocument = User & Document;

@Schema({ collection: 'users' })
class User extends Document {
  @Prop({ default: '', type: String })
  avatar: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: [], type: [String] })
  bkEmail: string[];

  @Prop({ default: '', type: String, required: false, unique: false })
  phone: string;

  @Prop({ default: 'user', type: String })
  role: AuthRoleEnum;

  @Prop({ default: '', type: String, required: false })
  terminalPassword: string;

  @Prop({ default: '', type: String })
  accessToken: string;

  @Prop({ default: '', type: String })
  refreshToken: string;

  @Prop({ default: '', type: String })
  wikiId: string;

  @Prop({
    required: false,
    default: {
      status: true,
      rejectReason: '',
    },
    type: Object,
  })
  prAuth: {
    status: boolean;
    rejectReason: string;
  };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  updatedAt: Date;

  @Prop({ default: null })
  lastLoginAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ ref: UserLog.name, default: [], type: [Types.ObjectId], required: false })
  logs: ObjectId[] | UserLog[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    // 删除敏感字段
    delete ret.accessToken;
    delete ret.refreshToken;
    // delete ret.terminalPassword;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    // 删除敏感字段
    delete ret.accessToken;
    delete ret.refreshToken;
    // delete ret.terminalPassword;
    return ret;
  },
});

// 在特定场景下返回带有 password 的对象
UserSchema.methods.toJSONWithPassword = function () {
  // 调用 toObject() 获取完整的对象
  const obj = this.toObject();
  return obj;
};

export { UserSchema, User, UserDocument };
