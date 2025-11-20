import { _t, _tHTML } from 'src/tools/i18n';
import kcsLevel1 from 'static/gempool/kcsLevel1.svg';
import kcsLevel2 from 'static/gempool/kcsLevel2.svg';
import kcsLevel3 from 'static/gempool/kcsLevel3.svg';
import kcsLevel4 from 'static/gempool/kcsLevel4.svg';
import vip0 from 'static/gempool/vip0.svg';
import vip1 from 'static/gempool/vip1.svg';
import vip10 from 'static/gempool/vip10.svg';
import vip11 from 'static/gempool/vip11.svg';
import vip12 from 'static/gempool/vip12.svg';
import vip2 from 'static/gempool/vip2.svg';
import vip3 from 'static/gempool/vip3.svg';
import vip4 from 'static/gempool/vip4.svg';
import vip5 from 'static/gempool/vip5.svg';
import vip6 from 'static/gempool/vip6.svg';
import vip7 from 'static/gempool/vip7.svg';
import vip8 from 'static/gempool/vip8.svg';
import vip9 from 'static/gempool/vip9.svg';

/**
 * Owner: jessie@kupotech.com
 */
export const POOL_STATUS = {
  NOT_START: 'notStart',
  IN_PROCESS: 'inProcess',
  COMPLETED: 'completed',
};

// 国际化key
export const REMARK_STATUS_TEXT = {
  notStart: '6333cacabda24000a67f',
  inProcess: '7e9ed96c04204000acbf',
  completed: '07e43af0e0574000a983',
};

export const VIP_ICONS = [
  vip0,
  vip1,
  vip2,
  vip3,
  vip4,
  vip5,
  vip6,
  vip7,
  vip8,
  vip9,
  vip10,
  vip11,
  vip12,
];

export const KCS_LEVEL_ICONS = [kcsLevel1, kcsLevel2, kcsLevel3, kcsLevel4];

export const POOL_TAG_TEXT = {
  1: () => _t('45923acc280b4000a0a1'), // 新用户专享
  2: () => _t('f676e3b7c6c84000ae32'), // 国家/地区专享
  3: () => _t('3d7b250e31f44000acd6'), // VIP专享
};

export const TASK_CONTENT_CONFIG = {
  // 参与答题活动享受质押加成
  0: {
    title: ({ maxBonusCoefficient } = {}) => _tHTML('b5dd9bb774da4800a889', {
      maxBonusCoefficient
    }),
    subTitle: ({ icon, num }) => _tHTML('cc13ba25ecb14000a132', { icon, num }),
  },
  // 根据您的VIP等级，已享受对应质押数量的加成
  1: {
    title: () => _t('738a65755eea4000a7a9'),
    subTitle: () => _tHTML('f0c92ecbfda74000a589'),
  },
  // KCS忠诚权益等级加成
  2: {
    title: () => _t('c0164264bc5a4800a6cc'),
    subTitle: () => _t('70f6cb03b68a4800af1a'),
  },
  // 邀请好友享受质押加成
  3: {
    title: () => _t('7e466c135d554000ad25'),
    subTitle: ({percent}) => _tHTML('a79c53a0cbbc4000ab7b', { percent }),
  },
};
