import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SyncUserDto } from '../dto/sync-user.dto';
import { AuthRoleEnum } from '../constants/user.constant';
import { PrRejectRecord, PrRejectRecordDocument } from '../schemas/pr-reject-record.user.schema';
import { MustReadInsightService } from 'src/insight/services/must-read.insight.service';
import { UserLog, UserLogDocument } from '../schemas/user-log.schema';
import { RequestUserInfo } from '../auth.types';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(PrRejectRecord.name)
    private readonly prRejectRecordModel: Model<PrRejectRecordDocument>,
    @InjectModel(UserLog.name)
    private readonly userLogModel: Model<UserLogDocument>,
    private readonly mustReadInsightService: MustReadInsightService,
  ) {
    //
  }

  /**
   * 获取用户选项配置列表
   * @returns
   */
  async getUserOptions() {
    const users = await this.userModel
      .find(
        {
          // isDeleted: false,
        },
        { _id: 1, name: 1, email: 1 },
      )
      .exec();
    return users.map((user) => ({
      value: user._id,
      label: user.name,
      email: user.email,
    }));
  }

  /**
   * 检查用户是否存在
   * @param email
   * @returns
   */
  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        email: {
          $regex: new RegExp(email, 'i'),
        },
      })
      .exec();
    return user;
  }

  /**
   * 创建用户
   * @param user
   * @returns
   */
  async createUser(user: any) {
    return await new this.userModel(user).save();
  }

  /**
   * 获取用户角色
   * @param email
   * @returns
   */
  async getRole(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user.role ?? AuthRoleEnum.USER;
  }

  /**
   * 获取所有用户
   * @returns
   */
  async getAllUsers(params: {
    current: number;
    pageSize: number;
    email?: string;
    name?: string;
    role?: string;
    phone?: string;
    readStatus?: 'error' | 'warning' | 'success';
    prAuthStatus?: 'true' | 'false';
  }) {
    const { current = 1, pageSize = 20, email, name, role, phone, readStatus, prAuthStatus } = params;
    const query: any = {
      isDeleted: false,
    };
    if (email) {
      query['email'] = {
        $regex: new RegExp(email, 'i'),
      };
    }
    if (name) {
      query['name'] = {
        $regex: new RegExp(name, 'i'),
      };
    }
    if (role) {
      query.role = role;
    }
    if (phone) {
      query['phone'] = {
        $regex: new RegExp(phone, 'i'),
      };
    }
    if (prAuthStatus) {
      // true 为已审核，
      // 此时 prAuth.status = true or prAuth = null 均为已审核
      // 使用mongoose $or 查询
      if (prAuthStatus === 'true') {
        query.$or = [
          {
            'prAuth.status': true,
          },
          {
            prAuth: null,
          },
        ];
      } else {
        query['prAuth.status'] = false;
      }
    }
    if (readStatus) {
      const data: UserDocument[] = await this.userModel.find(query).sort({ role: 1 }).sort({ name: 1 }).exec();
      const dataWithReadStatus = await Promise.all(
        data.map(async (user) => {
          const list = await this.mustReadInsightService.getMustReadWikiReadStatusByUserId(user._id as string);
          const _user = user.toJSON();
          delete _user.terminalPassword;
          return {
            ..._user,
            readStatus: list.some((l) => l.readStatus === 'error')
              ? 'error'
              : list.some((l) => l.readStatus === 'warning')
                ? 'warning'
                : 'success',
          };
        }),
      );
      const dataWithReadStatusFilter = dataWithReadStatus.filter((user) => user.readStatus === readStatus);
      const total = dataWithReadStatusFilter.length;

      return {
        list: dataWithReadStatusFilter.slice((current - 1) * pageSize, current * pageSize),
        total: total,
      };
    } else {
      const data: UserDocument[] = await this.userModel
        .find(query)
        .sort({ role: 1 })
        .sort({ name: 1 })
        .skip((current - 1) * pageSize)
        .limit(pageSize)
        .exec();

      const dataWithReadStatus = await Promise.all(
        data.map(async (user) => {
          const list = await this.mustReadInsightService.getMustReadWikiReadStatusByUserId(user._id as string);
          const _user = user.toJSON();
          delete _user.terminalPassword;
          return {
            ..._user,
            readStatus: list.some((l) => l.readStatus === 'error')
              ? 'error'
              : list.some((l) => l.readStatus === 'warning')
                ? 'warning'
                : 'success',
          };
        }),
      );
      const total = await this.userModel.countDocuments(query);
      return {
        list: dataWithReadStatus,
        total,
      };
    }
  }

  /**
   * 内部获取用户全部信息列表
   * @returns
   */
  async getOnlyAllUser() {
    return await this.userModel.find({
      isDeleted: false,
    });
  }

  /**
   * 更新用户
   * 最后登录时间，accessToken，refreshToken
   */
  async updateUserToken(email: string, data: Pick<UserDocument, 'accessToken' | 'refreshToken' | 'lastLoginAt'>) {
    return await this.userModel.updateOne(
      {
        email,
      },
      data,
    );
  }

  /**
   * 更新用户信息
   */
  async updateUser(
    _id: string,
    data: Partial<Pick<UserDocument, 'name' | 'email' | 'phone' | 'avatar' | 'prAuth' | 'terminalPassword'>>,
    reqUser: RequestUserInfo,
  ) {
    const currentUser = await this.userModel.findById(_id);
    await this.userModel.updateOne({ _id }, data).exec();
    const newUser = await this.userModel.findById(_id);
    if (currentUser.prAuth.status !== newUser.prAuth.status) {
      await new this.userLogModel({
        user: _id,
        action: 'prAuth.status',
        prev: currentUser.prAuth.status,
        current: newUser.prAuth.status,
        actionBy: reqUser.id,
      }).save();

      if (newUser.prAuth.status === false) {
        await new this.userLogModel({
          user: _id,
          action: 'prAuth.rejectReason',
          prev: '-',
          current: newUser.prAuth.rejectReason,
          actionBy: reqUser.id,
        }).save();
      }
    }
    if (currentUser.role !== newUser.role) {
      await new this.userLogModel({
        user: _id,
        action: 'role',
        prev: currentUser.role,
        current: newUser.role,
        actionBy: reqUser.id,
      }).save();
    }
  }

  /**
   * 通过id获取用户
   */
  async getUserById(id: string) {
    return this.userModel.findById(id).exec();
  }

  /**
   * 删除用户
   */
  async deleteUser(id: string) {
    return this.userModel
      .findByIdAndUpdate(
        {
          _id: id,
        },
        {
          isDeleted: true,
        },
      )
      .exec();
  }

  /**
   * 同步用户数据
   * @param data
   * @returns
   */
  async syncUser(data: SyncUserDto): Promise<any> {
    let successTaskCount = 0;
    let updateCount = 0;
    let createCount = 0;
    const fnMap = data.data.map(async (item) => {
      const query: any = {
        $or: [],
      };

      if (item._id) {
        query.$or.push({ _id: item._id });
      }
      if (item.user.email) {
        query.$or.push({ email: { $regex: item.user.email, $options: 'i' } });
      }
      const user = await this.userModel.findOne(query);

      if (user) {
        await this.userModel.updateOne(
          { _id: user._id },
          {
            $set: {
              name: item.user.displayName,
              phone: item.user.phone,
              role: (item?.roles || []).includes(AuthRoleEnum.ADMIN) ? AuthRoleEnum.ADMIN : AuthRoleEnum.USER,
              createdAt: item?.createdAt ?? new Date(),
              isDeleted: false,
            },
          },
        );
        updateCount++;
      } else {
        await new this.userModel({
          name: item.user.displayName,
          email: item.user.email,
          phone: item.user.phone,
          role: (item?.roles || []).includes(AuthRoleEnum.ADMIN) ? AuthRoleEnum.ADMIN : AuthRoleEnum.USER,
          createdAt: item?.createdAt ?? new Date(),
        }).save();
        createCount++;
      }
      successTaskCount++;
    });

    await Promise.all(fnMap);

    return {
      totalTaskCount: data.data.length,
      successTaskCount,
      updateCount,
      createCount,
    };
  }

  /**
   * 通过邮箱和密码获取用户
   * @param email
   * @returns
   */
  async getUserByEmailAndPassword(email: string, password: string) {
    return await this.userModel.findOne({
      email,
      password,
    });
  }

  /**
   * 获取用户的PR审核权限
   * @param email
   * @returns
   */
  async getUserPrAuth(email: string): Promise<{
    status: boolean;
    rejectReason: string;
  } | null> {
    const user = await this.userModel
      .findOne({
        email: {
          $regex: new RegExp(email, 'i'),
        },
      })
      .exec();

    if (user) {
      return user.prAuth;
    }

    return null;
  }

  /**
   * 添加PR拒绝记录
   * @param email
   * @param link
   * @param reason
   * @returns
   */
  async addPrRejectRecord(email: string, link: string, reason: string) {
    const user = await this.getUserByEmail(email);
    return await new this.prRejectRecordModel({
      user: user._id,
      link,
      reason,
    }).save();
  }

  /**
   * 批量添加PR拒绝记录
   * @param data
   * @returns
   */
  async addPrRejectRecords(data: PrRejectRecordDocument[]) {
    return await this.prRejectRecordModel.insertMany(data);
  }

  /**
   * 获取被PR拒绝的User通过邮箱数组
   */
  async getPrRejectInEmails(emails: string[]) {
    // user.prAuth.status = false;
    return await this.userModel.find({
      email: { $in: emails },
      'prAuth.status': false,
    });
  }

  /**
   * 获取PR拒绝记录
   * @param params
   * @returns
   */
  async getPrRejectRecord(params: { current: number; pageSize: number; user?: string }) {
    const { current = 1, pageSize = 20, user } = params;
    const query: any = {};
    if (user) {
      query['user'] = new Types.ObjectId(user);
    }
    const data = await this.prRejectRecordModel
      .find(query)
      .populate('user')
      .sort({ createdAt: -1 })
      .skip((current - 1) * pageSize)
      .limit(pageSize)
      .exec();
    const total = await this.prRejectRecordModel.countDocuments(query);
    return {
      list: data,
      total,
    };
  }

  /**
   * 获取用户操作日志
   * @param id
   * @returns
   */
  async getUserActionLogs(id: string) {
    return await this.userLogModel
      .find({
        user: id,
      })
      .populate('user')
      .populate('actionBy')
      .sort({ createdAt: -1 })
      .exec();
  }
}
