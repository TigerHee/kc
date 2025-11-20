import {deleteRequest, postJson, pull} from 'utils/request';

const COPY_TRADE_PREFIX = '/ct-copy-trade';
const COPY_TRADE_ACCOUNT_PREFIX = '/ct-account';
const TRADE_PREFIX = '/ct-trade';

/**
 * 申请成为交易员
 */
export const applyLeadTraders = params => {
  return postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadTraders/apply`,
    params,
  );
};

/**
 * 带单资产查询
 */
export const queryLeadAccountBalance = subId => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/lead/account/balance`,
    {},
    {
      'X-SUB-UID': subId,
    },
  );
};

/**
 * 带单资产划转
 */
export const copyTradeLeaderTransfer = async (subId, params) => {
  return await postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/lead/transfer`,
    params,
    false,
    {
      'X-SUB-UID': subId,
    },
  );
};

/**
 * 划转记录查询
 */
export const queryTransferRecords = subId => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/transfer/detail`,
    {},
    {
      'X-SUB-UID': subId,
    },
  );
};

/**
 * 查询带单配置信息，
 */
export const queryTraderCopyFormConfig = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/trader/expert/info`,
    params,
  );
};

/**
 * 发起跟单
 */
export const createCopyConfig = async params => {
  return await postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/copy/config`,
    params,
  );
};

/**
 * 更新跟单配置
 */
export const updateCopyConfig = async params => {
  return await postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/copy/config/update`,
    params,
  );
};
/**
 * 查看跟单详情
 */
export const getCopyConfigInfo = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/copy/config/info`,
    params,
  );
};

/**
 * 解除跟单
 */
export const doCancelCopyConfig = async params => {
  return await postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/copy/cancel`,
    params,
  );
};

/**
 *  获取当前交易员带收益信息 列表
 */
export const queryCurrentMyCopyTraderList = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/copyHomePage/traders/current`,
    params,
  );
};

/**
 *  获取历史交易员带单收益信息
 */
export const queryHistoryMyCopyTraderList = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/traders/history`,
    params,
  );
};

/**
 *  获取当前/历史 跟随过的交易员用户基本信息
 */
export const queryFollowedTraderBasicInfo = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/traders/info`,
    params,
  );
};

/**
 *  获取我的跟单 当前仓位信息
 */
export const queryMyCopyCurrentPositionList = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/copyHomePage/positions/current`,
    params,
  );
};

/**
 *  获取我的跟单 历史仓位信息
 */
export const queryMyCopyHistoryPositionList = async params => {
  return await pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/positions/history`,
    params,
  );
};

/**
 *  获取我的跟单 收益汇总信息
 */
export const queryMyCopyShowPnlSummary = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/summary`,
    params,
  );
};

/**
 *  获取我的带单 历史仓位信息
 */
export const queryMyLeadHistoryPositionList = params => {
  const {subUID, ...others} = params;

  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadHomePage/positions/history`,
    {
      ...others,
      leadSubUid: subUID,
    },
  );
};

/**
 *  获取我的带单 当前仓位信息
 */
export const queryMyLeadCurrentPositionList = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/leadHomePage/positions/current`,
    params,
  );
};

/**
 *  获取我的带单下 跟单人列表
 */
export const queryMyLeadCopyFollowersList = ({subUID, ...params}) => {
  return pull(`${COPY_TRADE_PREFIX}/v1/copyTrading/copyTraders`, params, {
    'X-SUB-UID': subUID,
  });
};

/**
 *  获取我的带单 子账号信息 列表
 */
export const queryActiveLeadTraders = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/leadTraders/active`,
    params,
  );
};

/**
 *  获取我的带单 带单账号汇总信息
 */
export const queryMyLeadShowPnlSummary = ({leadConfigId, subUID}) => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/leadTraders/summary`,
    {
      leadConfigId,
    },
    {
      'X-SUB-UID': subUID,
    },
  );
};

/**
 *  获取我的带单 所有带单总盈亏历史（按天）
 */
export const queryMyLeadPnlHistoryList = ({leadConfigId, subUID}) => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadTraders/pnl/history`,
    {
      leadConfigId,
    },
    {
      'X-SUB-UID': subUID,
    },
  );
};

/**
 *  查询 我作为带单人 详情包含 审核中的个人信息
 */
export const queryMyLeaderDetail = ({leadConfigId, subUID}) => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadTraders/details`,
    {
      leadConfigId,
    },
    {
      'X-SUB-UID': subUID,
    },
  );
};

/**
 *  获取带单展示汇总
 */
export const queryTraderDetailShowInfoSummary = async ({leadConfigId}) => {
  return await pull(`${COPY_TRADE_PREFIX}/v1/copyTrading/leadShow/summary`, {
    leadConfigId,
  });
};

/**
 *  获取带单展示带单总览
 */
export const queryTraderDetailOverview = ({leadConfigId}) => {
  return pull(`${COPY_TRADE_PREFIX}/v1/copyTrading/leadShow/overview`, {
    leadConfigId,
  });
};

/**
 *  获取带单展示收益
 */
export const queryTraderDetailPnl = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadShow/pnl/history`,
    params,
  );
};

/**
 *  获取带单展示 持仓分布
 */
export const queryTraderDetailPositionDistribution = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadShow/positionHistory`,
    params,
  );
};

/**
 *  获取带单展示 币种偏好
 */
export const queryTraderDetailCurrencyPreference = ({leadConfigId}) => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadShow/currencyPreference`,
    {
      leadConfigId,
    },
  );
};

/**
 *  获取我的带单下 我的跟单者
 */
export const queryTraderDetailCopyTraders = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadShow/copyTraders`,
    params,
  );
};

/**
 *  关注交易员
 */
export const doFollowTrader = params => {
  return postJson(
    `${COPY_TRADE_ACCOUNT_PREFIX}/v1/copyTrading/account/follow`,
    params,
  );
};

/**
 *  获取我的跟单 我的关注列表
 */
export const queryMyFollowTraderList = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/myFollowLeads`,
    params,
  );
};

/**
 * 获取带单人30天收益详情
 */
export const queryLeadThirtyDaySummary = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadHomePage/thirtyDaySummary`,
    params,
  );
};

/**
 * 获取交易员 仓位汇总 收益信息
 */
export const getSpecifyTraderInfo = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/getSpecifyTraderInfo`,
    params,
  );
};

/**
 * 获取跟指定交易员的跟单时长及收益
 */
export const getTraderCopyDurationAndProfit = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/getTraderCopyDurationAndProfit`,
    params,
  );
};

/**
 * 获取带单分润汇总
 */
export const getProfitShareSummary = ({subUID, ...params}) => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadTraders/profitSharing/summary`,
    params,
    {
      'X-SUB-UID': subUID,
    },
  );
};

/**
 * 带单人信息修改
 */
export const modifyMyLeadTraderInfo = ({subUID, ...params}) => {
  return postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/leadTraders/modify`,
    params,
    false,
    {
      'X-SUB-UID': subUID,
    },
  );
};

/**
 * 获取排行榜
 */
export const queryLeaderBoard = params => {
  return postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/leaderboard/query`,
    params,
  );
};

/**
 * 获取跟单交易员仓位汇总相关详情
 */
export const getCopyTraderPositionSummaryInfo = params => {
  return pull(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/copyHomePage/getCopyInfo`,
    params,
  );
};

/**
 * 获取 是否跟过单
 */
export const queryHasCopyConfig = params => {
  return pull(`${TRADE_PREFIX}/futures/copy/config/hasCopyConfig`, params);
};

/**
 * 撤销带单 查询取消原因选项
 * 请求参数：无
 * 返回结果：返回数组
 */
export const getRevertLeadCancelReasonOptions = () => {
  return pull(`${TRADE_PREFIX}/v1/copyTrading/cancel/reason/options`);
};

/**
 * 撤销带单 提交取消原因
 * 对象字段：
 *   @ApiModelProperty("建议反馈内容")
 *   @Length(require = false, max = 100, message = "suggest can not exceed 100 characters")
 *   private String suggestContent;
 *
 *   @ApiModelProperty("取消原因，多选，传原因id")
 *   private Set<Long> cancelReasonIds;
 *   private Long leadConfigId;
 * 返回结果：无
 */
export const submitRevertLeadReason = params => {
  return postJson(`${TRADE_PREFIX}/v1/copyTrading/cancel/reason/apply`, params);
};

/**
 * 查询账户总权益
 * 请求参数： leadConfigId
 * 返回结果：账户总权益值
 */
export const getAccountTotalEquity = async params => {
  return pull(`${TRADE_PREFIX}/v1/copyTrading/futures/lead/equity`, params);
};

/**
 * 查询带单者活跃订单和仓位信息
 * 请求参数： leadConfigId
 * 返回结果：对象
 * 对象字段：
 *   @ApiModelProperty("活跃订单的数量")
 *   private Integer orderNum;
 *   @ApiModelProperty("仓位数量： 指的是用户持有多少个交易对的仓位，不是具体的仓位大小")
 *   private Integer positionNum;
 */
export const getLeadOrderPositionInfo = params => {
  return pull(
    `${TRADE_PREFIX}/v1/copyTrading/futures/lead/order-position-num`,
    params,
  );
};

/**
 * 带单发起撤销
 * 请求参数： leadConfigId
 * header携带 subId
 */
export const leadCancel = payload => {
  const {subUID, ...params} = payload || {};
  return postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/lead/cancel`,
    params,
    false,
    {
      'X-SUB-UID': subUID,
    },
  );
};

/**
 * 关闭操作去确认 已经注销交易员跟单
 * 请求参数： 参数：copyConfigId
 */
export const closeCopyConfigId = ({copyConfigId}) => {
  return postJson(
    `${TRADE_PREFIX}/v1/copyTrading/futures/copy/confirm/close?copyConfigId=${copyConfigId}`,
  );
};

/**
 * 搜索交易员列表
 */
export const queryLeadTrader = params => {
  return pull(`${COPY_TRADE_PREFIX}/v1/copyTrading/leadTraders/query`, params);
};

/**
 * 查询跟单最大变动保证金：
 */
export const queryMaxChangeInvestment = params => {
  return pull(
    `${TRADE_PREFIX}/v1/copyTrading/futures/copy/max-change-investment`,
    params,
  );
};

/**
 * 跟单加减保证金：
 */
export const transferCopyMaxAmount = params => {
  return postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/futures/copy/transfer`,
    params,
  );
};

/**
 *取消 跟单/带单 的 仓位/交易员 TP/SL 订单
 */
export const cancelStopTakeOrder = ({subUid, ...params}) => {
  return deleteRequest(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/rn/futures/cancelStopTakeOrder`,
    params,
    {
      'X-SUB-UID': subUid,
    },
  );
};

/**
 * 查询用户未签署的协议
 * @param {boolean} isLead - 是否为带单交易员
 * @returns {Promise<Array<{
 *   articleId: number,
 *   title: string,
 *   context: string,
 *   url: string,
 *   version: string,
 *   updatedAt: number,
 *   publishTime: string,
 *   summary: string
 * }>>}
 */
export const queryUnsignedTerms = isLead => {
  return pull(`${COPY_TRADE_PREFIX}/v1/copyTrading/user/terms/un-signed`, {
    isLead,
  });
};

/**
 * 签署未签署的协议
 * @param {boolean} isLead - 是否为带单交易员
 * @returns {Promise<void>}
 */
export const signTerms = isLead => {
  return postJson(
    `${COPY_TRADE_PREFIX}/v1/copyTrading/user/terms/sign?isLead=${isLead}`,
  );
};

/**
 * 获取合规 kyc 等级
 * 目前仅au 站 有相关限制 其他站点调用返回异常
 * @returns {Promise<number>}
 */
export const getUserKycLevel = () => {
  return pull(`${COPY_TRADE_PREFIX}/v1/copyTrading/futures/user-kyc-level`);
};
