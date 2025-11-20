import * as crypto from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InvokeAgendaService } from 'src/agenda/services/invoke.agenda.service';
import { ScheduleTriggerEnum } from 'src/agenda/types';
import { NotificationLarkService } from 'src/notification/services/lark.notification.service';
import DEFINER_JOB_ENUMS from 'src/agenda/constants/definer.constants';
import { ALERT_SERVICE_TOKEN } from '../http/alert.http.module';
import { Alert, AlertDocument } from '../schemas/alert.schema';
import { Status, TIME_LAG8, ALARM_GROUP_LIST } from '../utils';
import { toQueryParams, getHashContent, getUid } from '../utils/tool';
import { KunlunLogger } from 'src/common/kunlun.logger';
import { AlertGroupService } from './alert-group.service';

@Injectable()
export class AlertService {
  kunlunLogger = new KunlunLogger(AlertService.name);
  constructor(
    @Inject(ALERT_SERVICE_TOKEN) private readonly AlertHttpModule,
    @InjectModel(Alert.name) private alertModel: Model<AlertDocument>,
    private readonly invokeAgendaService: InvokeAgendaService,
    private readonly alertGroupService: AlertGroupService,
    private readonly notificationLarkService: NotificationLarkService,
  ) {}

  // 调用扫描调度任务
  async callTaskImmediateScanAlerts({
    body = {},
    user,
  }: {
    body: { start_time?: string; end_time?: string; hour?: string };
    user: { name: string };
  }) {
    return await this.invokeAgendaService.callTaskImmediate(DEFINER_JOB_ENUMS.KUNLUN_SCAN_ALERT_V1, {
      payload: body,
      triggerUser: user.name ?? 'system',
      triggerSource: ScheduleTriggerEnum.API,
    });
  }

  async scanAlerts(params?: { start_time?: string; end_time?: string; hour?: string }): Promise<Alert[]> {
    const allAlerts: Alert[] = [];
    let currentPage = 1;
    let totalPage = 1;
    const hour = Number(params?.hour ?? 1);

    const groups = await this.alertGroupService.getAlarmGroups();
    const groupList = groups.map((i) => i.name);
    const queryGroupList = groupList.length > 0 ? groupList : ALARM_GROUP_LIST;

    while (currentPage <= totalPage) {
      try {
        const queryBase = {
          // 在x小时的基础上多减 10 min
          start_time: Date.now() - (hour * 60 + 10) * 60 * 1000,
          end_time: Date.now(),
          schedule_group_list: queryGroupList,
          page_no: currentPage,
          page_size: 100,
        };
        const queryData = {
          ...queryBase,
          ...params,
        };

        let response;
        try {
          response = await this.AlertHttpModule.get(`/external/alarm/query?${toQueryParams(queryData)}`).toPromise();
        } catch (err) {
          const msg = `请求kunlun接口异常: ${err?.message || err}`;
          this.kunlunLogger.error(msg);
        }

        const data = response?.data || {};
        totalPage = data?.result?.totalPage || 1;
        const alertList = data?.result?.data || [];

        if (!Array.isArray(alertList) || alertList.length === 0) return;

        for (const item of alertList) {
          try {
            const { message, alertStrategy } = item;
            // 根据告警内容生成唯一 alertId
            const alertId = crypto.createHash('md5').update(getHashContent(item)).digest('hex');

            const updateData = {
              ...item,
              _id: getUid(),
              alertId,
              kunlunId: [item._id],
              status: Status.INIT,
              operator: [],
              viewData: {},
              finishData: {},
              alertMsg: message?.includes('cypress') ? message : alertStrategy?.name,
              createTime: Date.now(),
            };

            // 如果 alertId 存在就 push _id 跳过插入数据
            const existingRecord = await this.alertModel.findOne({ alertId });
            if (existingRecord) {
              const updatedKunlunId = Array.from(new Set([...(existingRecord.kunlunId || []), item._id]));
              await this.alertModel.updateOne({ _id: existingRecord._id }, { $set: { kunlunId: updatedKunlunId } });
              this.kunlunLogger.warn(`更新kunlunId 并跳过插入: alertId=${alertId} `);
            } else {
              // 额外检查 item._id 是否已存在于其他记录的 kunlunId 数组中
              const existingByKunlunId = await this.alertModel.findOne({ kunlunId: item._id });
              if (existingByKunlunId) {
                this.kunlunLogger.warn(`已有记录包含该 kunlunId=${item._id}，跳过插入: alertId=${alertId}`);
                continue; // 跳过本条 alert 处理
              }

              // 插入数据
              const result = await this.alertModel.updateOne(
                { _id: updateData._id },
                { $set: updateData },
                { upsert: true },
              );

              if (result.upsertedCount === 1) {
                this.kunlunLogger.warn(`插入新告警: alertId=${alertId}`);
              }

              allAlerts.push(updateData);
            }
          } catch (err) {
            this.kunlunLogger.error(`处理单条 alert 失败: ${err?.message || err}`);
          }
        }

        currentPage++;
      } catch (err) {
        const msg = `处理第 ${currentPage} 页失败: ${err?.message || err}`;
        this.kunlunLogger.error(msg);
        throw new Error(msg);
      }
    }

    return allAlerts;
  }

  // 查询告警组列表
  async getAlertList(params: {
    alarmGroup?: string;
    status?: string;
    alertMsg?: string;
    appKey?: string;
    pageSize?: number;
    current?: number;
    isFinished?: 'true' | 'false';
    relationUser?: string;
  }) {
    const { alarmGroup, status, alertMsg, appKey, pageSize = 10, current = 1, isFinished, relationUser } = params;

    const filter: Record<string, any> = {};

    if (alarmGroup) {
      filter.alarmGroup = { $regex: alarmGroup, $options: 'i' }; // 模糊匹配 + 忽略大小写
    }
    if (status) {
      filter.status = status;
    }
    if (alertMsg) {
      filter.alertMsg = { $regex: alertMsg, $options: 'i' }; // 模糊匹配 + 忽略大小写
    }
    if (appKey) {
      filter.appKey = { $regex: appKey, $options: 'i' }; // 模糊匹配 + 忽略大小写
    }
    if (isFinished) {
      if (isFinished === 'true') {
        filter['finishData.email'] = { $exists: true, $ne: '' };
        // $exists: true 检查字段存在，$ne: '' 确保不是空字符串
      } else if (isFinished === 'false') {
        filter['finishData.email'] = '';
      }
    }

    if (relationUser) {
      const regex = new RegExp(relationUser, 'i'); // 忽略大小写
      filter['$or'] = [
        ...(filter['$or'] || []),
        { 'operator.email': regex },
        { 'viewData.email': regex },
        { 'finishData.email': regex },
        { teamsSendList: regex }, // 数组中任意一项匹配即可
      ];
    }

    const skip = (current - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.alertModel.find(filter).skip(skip).limit(pageSize).sort({ createTime: -1 }).lean(),
      this.alertModel.countDocuments(filter),
    ]);

    return {
      list: data,
      pagination: {
        current,
        pageSize,
        total,
        totalPage: Math.ceil(total / pageSize),
      },
    };
  }

  // 查询告警详情
  async getAlertDetail(
    params: { alarmGroup?: string; url?: string; message?: string; _id?: string },
    // user: { name: string },
  ) {
    const { alarmGroup, url, message, _id } = params;

    const filter: Record<string, any> = {};

    if (_id) {
      filter._id = _id;
    }
    if (alarmGroup) {
      filter.alarmGroup = { $regex: alarmGroup, $options: 'i' };
    }
    if (url) {
      filter['teamsHrefData.url'] = { $regex: url, $options: 'i' }; // 模糊匹配 url
    }
    if (message) {
      filter.message = message;
    }

    const detail = await this.alertModel.findOne(filter).sort({ createTime: -1 }).lean();
    if (!detail || (detail.finishData.email && !_id)) {
      // await this.callTaskImmediateScanAlerts({ body: {}, user });
      // 这里需要同步调用然后查询返回最新的数据
      await this.scanAlerts();
      const retryDetail = await this.alertModel.findOne(filter).sort({ createTime: -1 }).lean();

      if (!retryDetail) {
        throw new Error('告警详情未找到');
      }

      return retryDetail;
    }

    return detail;
  }

  // 修改告警状态
  async changeAlertStatus({
    body,
    user,
  }: {
    body: { _id: string; status: string; remark?: string };
    user: { email: string };
  }) {
    const { _id, status, remark } = body;
    const { email } = user;

    const alert = await this.alertModel.findById(_id);

    if (!alert) {
      throw new Error(`找不到对应的告警记录，_id: ${_id}`);
    }

    const now = Date.now();
    const operatorEntry = {
      email,
      time: now,
      status,
      remark,
    };

    const setData: Record<string, any> = {
      status,
      remark,
      insightUpdateTime: now,
    };

    // 非未处理状态把alertId改了，方便生成新的告警
    // if (status !== Status.INIT) {
    //   setData = { ...setData, alertId: getUid() };
    // }

    // 更新 status、remark，并追加 operator 记录
    await this.alertModel.updateOne(
      { _id },
      {
        $set: setData,
        $push: {
          operator: operatorEntry,
        },
      },
    );

    // 如果不是问题，直接完成
    if (status === Status.MISS) {
      await this.changeAlertData({ body: { _id, type: 'finish' }, user });
    }

    return { success: true };
  }

  // 修改结果相关数据
  async changeAlertData({
    body,
    user,
  }: {
    body: { _id: string; type: 'view' | 'finish'; isReset?: boolean };
    user: { email: string };
  }) {
    const { _id, type, isReset } = body;
    const { email } = user;

    const alert = await this.alertModel.findById(_id);
    if (!alert) {
      throw new Error(`找不到对应的告警记录，_id: ${_id}`);
    }

    const now = Date.now();
    const fieldKey = type === 'view' ? 'viewData' : 'finishData';

    // 如果已有值，不进行更新
    if (alert[fieldKey] && alert[fieldKey]?.email && !isReset) {
      return { success: false, message: `${fieldKey} 已存在，未更新` };
    }

    const updateData: Record<string, any> = {
      [fieldKey]: isReset
        ? {}
        : {
            email,
            time: now,
          },
    };

    // type 为 finish 时，增加 alertId 更新
    if (type === 'finish' && !isReset) {
      updateData.alertId = getUid();
    }

    await this.alertModel.updateOne(
      { _id },
      {
        $set: updateData,
      },
    );

    return { success: true, message: `${fieldKey} 设置成功` };
  }

  // 告警分析
  async getAlertAnalyze(params: { startTime: number; endTime: number }) {
    const { startTime, endTime } = params;
    if (!startTime || !endTime) {
      throw new Error('startTime 和 endTime 是必填参数');
    }

    const raw = await this.alertModel
      .aggregate([
        {
          $match: {
            createTime: { $gte: startTime, $lte: endTime },
          },
        },
        {
          $project: {
            alarmGroup: 1,
            status: 1,
            createTime: 1,
            isFinish: {
              $cond: [{ $and: [{ $ne: ['$finishData.email', null] }, { $ne: ['$finishData.email', ''] }] }, 1, 0],
            },
            finishTime: {
              $cond: [
                {
                  $and: [{ $eq: ['$status', Status.URGENCY] }, { $gt: ['$finishData.time', 0] }],
                },
                { $subtract: ['$finishData.time', '$createTime'] },
                null,
              ],
            },
            isView: {
              $cond: [{ $and: [{ $ne: ['$viewData.email', null] }, { $ne: ['$viewData.email', ''] }] }, 1, 0],
            },
            viewTime: {
              $cond: [{ $gt: ['$viewData.time', 0] }, { $subtract: ['$viewData.time', '$createTime'] }, null],
            },
            workViewTime: {
              $cond: [
                {
                  $and: [
                    { $gt: ['$viewData.time', 0] },
                    {
                      $in: [{ $dayOfWeek: { $toDate: { $add: ['$viewData.time', TIME_LAG8] } } }, [2, 3, 4, 5, 6]],
                    },
                    {
                      $or: [
                        {
                          $and: [
                            {
                              $gte: [{ $hour: { $toDate: { $add: ['$viewData.time', TIME_LAG8] } } }, 10],
                            },
                            {
                              $lt: [{ $hour: { $toDate: { $add: ['$viewData.time', TIME_LAG8] } } }, 12],
                            },
                          ],
                        },
                        {
                          $and: [
                            {
                              $gte: [{ $hour: { $toDate: { $add: ['$viewData.time', TIME_LAG8] } } }, 14],
                            },
                            {
                              $lt: [{ $hour: { $toDate: { $add: ['$viewData.time', TIME_LAG8] } } }, 18],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { $subtract: ['$viewData.time', '$createTime'] },
                null,
              ],
            },
          },
        },
        {
          $group: {
            _id: '$alarmGroup',
            statusCounts: { $push: '$status' },
            total: { $sum: 1 },
            finishTotal: { $sum: '$isFinish' },
            finishTimeList: { $push: '$finishTime' },
            viewTotal: { $sum: '$isView' },
            viewTimeList: { $push: '$viewTime' },
            workViewTotal: {
              $sum: {
                $cond: [{ $ne: ['$workViewTime', null] }, 1, 0],
              },
            },
            workViewTimeList: { $push: '$workViewTime' },
          },
        },
      ])
      .exec();

    const allStatuses = Object.values(Status);
    const validStatusKeys = [Status.URGENCY, Status.NOT_URGENCY, Status.DEPEND, Status.PENDING];

    const result = raw.map((item) => {
      const statusMap = Object.fromEntries(allStatuses.map((s) => [s, 0]));
      for (const status of item.statusCounts) {
        if (statusMap[status] !== undefined) {
          statusMap[status]++;
        }
      }

      const validTotal = validStatusKeys.reduce((sum, key) => sum + (statusMap[key] || 0), 0);

      const viewTimeList = item.viewTimeList
        .filter((v: number | null): v is number => v !== null)
        .sort((a, b) => a - b);
      const finishTimeList = item.finishTimeList
        .filter((v: number | null): v is number => v !== null)
        .sort((a, b) => a - b);
      const workViewTimeList = item.workViewTimeList
        .filter((v: number | null): v is number => v !== null)
        .sort((a, b) => a - b);

      return {
        alarmGroup: item._id,
        total: item.total,
        validTotal,
        statusCounts: statusMap,
        finishTotal: item.finishTotal,
        finishTimeList,
        viewTotal: item.viewTotal,
        viewTimeList,
        // 工作时间 view 数据
        workViewTotal: item.workViewTotal,
        workViewTimeList,
      };
    });

    result.sort((a, b) => b.total - a.total);

    const summary = result.reduce(
      (acc, item) => {
        acc.total += item.total;
        acc.finishTotal += item.finishTotal;
        acc.viewTotal += item.viewTotal;
        acc.validTotal += item.validTotal;
        acc.workViewTotal += item.workViewTotal;

        for (const status of Object.keys(item.statusCounts)) {
          acc.statusCounts[status] += item.statusCounts[status];
        }

        acc.viewTimeList.push(...item.viewTimeList);
        acc.finishTimeList.push(...item.finishTimeList);
        acc.workViewTimeList.push(...item.workViewTimeList);

        return acc;
      },
      {
        alarmGroup: '数据汇总',
        total: 0,
        finishTotal: 0,
        viewTotal: 0,
        validTotal: 0,
        workViewTotal: 0,
        statusCounts: Object.fromEntries(allStatuses.map((s) => [s, 0])),
        viewTimeList: [] as number[],
        finishTimeList: [] as number[],
        workViewTimeList: [] as number[],
      },
    );

    summary.viewTimeList.sort((a, b) => a - b);
    summary.finishTimeList.sort((a, b) => a - b);
    summary.workViewTimeList.sort((a, b) => a - b);

    result.unshift(summary);

    return {
      list: result,
    };
  }

  // 查询未处理的消息
  async getAlertBacklog() {
    const result = await this.alertModel.aggregate([
      {
        $match: {
          status: Status.INIT,
        },
      },
      {
        $sort: {
          createTime: -1,
        },
      },
      {
        $group: {
          _id: '$alarmGroup',
          count: { $sum: 1 },
          latestTeamsSendList: { $first: '$teamsSendList' },
          latestCreateTime: { $first: '$createTime' },
        },
      },
      {
        $project: {
          alarmGroup: '$_id',
          _id: 0,
          count: 1,
          latestTeamsSendList: 1,
          latestCreateTime: 1,
        },
      },
      {
        $sort: {
          alarmGroup: 1,
        },
      },
    ]);

    if (result?.length > 0) {
      await this.notificationLarkService.sendAlertBacklogMessage({
        tableData: result.map((i) => {
          const { latestTeamsSendList } = i;
          return {
            ...i,
            emailBatch: latestTeamsSendList.map((email) => `<at email="${email.toLocaleLowerCase()}"></at>`).join(''),
          };
        }),
      });
    }

    return result;
  }
}
