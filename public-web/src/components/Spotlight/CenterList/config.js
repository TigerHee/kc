/**
 * Owner: jessie@kupotech.com
 */
// 注意： 新增类型这里需要添加
export const ActivityType = {
  RANK: 1, // 竞赛
  AIRDROP: 2, // 空投
  VOTE: 3, // 投票
  UNIVERSAL: 4, // 万能活动
  SPOTLIGHT: 8, // SPOTLIGHT抢购
  SPOTLIGHT2: 9, // SPOTLIGHT2预约抽签
  DISTRIBUTE: 12, // 代币分发活动
  SPOTLIGHT5: 13, // SPOTLIGHT5
  SPOTLIGHT6: 14, // SPOTLIGHT6
  SPOTLIGHT7: 15, // SPOTLIGHT7
  SPOTLIGHT8: 16, // SPOTLIGHT8
};

export const SpotlightActivityType = [
  ActivityType.SPOTLIGHT,
  ActivityType.SPOTLIGHT2,
  ActivityType.SPOTLIGHT5,
  ActivityType.SPOTLIGHT6,
  ActivityType.SPOTLIGHT7,
  ActivityType.SPOTLIGHT8,
];

export const ActivityStatus = {
  WAIT_START: 1,
  PROCESSING: 2,
  WAIT_REWARD: 3,
  OVER: 4,
};

export const styleConfig = {
  [ActivityStatus.WAIT_START]: {
    cls: 'wait_start',
    text: 'will.start',
  },
  [ActivityStatus.PROCESSING]: {
    cls: 'processing',
    text: 'in.progress',
  },
  [ActivityStatus.WAIT_REWARD]: {
    cls: 'wait_award',
    text: 'releasing',
  },
  [ActivityStatus.OVER]: {
    cls: 'stop',
    text: 'ended',
  },
};
