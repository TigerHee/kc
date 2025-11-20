/**
 * Owner: gavin.liu1@kupotech.com
 */
import { cloneDeep } from "lodash"
import { OkIcon, TriangleIcon } from "./TriangleIcon"
import { MODAL_MAP } from "../common/map"
import futureTrailUrl from 'src/assets/referFriend/awards/future-trail.svg'
import futureUrl from 'src/assets/referFriend/awards/future.svg'
import usdtUrl from 'src/assets/referFriend/awards/usdt.svg'
import vipUrl from 'src/assets/referFriend/awards/vip.svg'
import travelUrl from 'src/assets/referFriend/awards/travel.svg'
import { _t, _tHTML } from 'utils/lang';

export const TABS = {
  help: 'help',
  award: 'award',
}

const yellow = `#FFF997`
export const gray = `#3C475B`
const green = `#01BC8D`
const p_48 = (90 / 96) * 100

export const MODE = {
  // 用户未登陆状态
  notLogin: 'notLogin',
  // 初始化
  init: 'init',
  // 阶段1-没有达到礼包3（50 USDT）奖励, 和 init 相比只差文案
  phase_1: 'phase_1',
  // 阶段2-达到礼包3（50 USDT）奖励，没有达到礼包4（10000USDT）奖励
  phase_2: 'phase_2',
  // 阶段3 - 达到礼包4（10000 USDT）奖励
  phase_3: 'phase_3',
}

export const getHomeInfoMap = () => {
  // 待提现
  const WAIT_WITHDRAW = _t('nmc9eQZoHRhJusv5N1GcLt')
  // 已提现
  const WITHDRAWED = _t('8mbpwa12Ghv1FibjZgSpiC')

  const map = {
    // 用户未登陆状态
    [MODE.notLogin]: {
      title: _t('4VSBCRvcqKHw6sHUnXQkJS'),
      first: {
        color: yellow,
        count: p_48,
        icon: (color) => <TriangleIcon fill={color || yellow} />,
        top: {
          color: yellow,
        },
        bottom: {
          color: yellow,
          text: WAIT_WITHDRAW
        }
      },
      second: {
        color: gray,
        count: 0,
        icon: (color) => <TriangleIcon fill={color || gray} />,
        top: {
          color: gray,
        },
        bottom: {
          color: gray,
          text: WAIT_WITHDRAW
        }
      }
    },
    // 初始化
    [MODE.init]: {
      title: (num) => _tHTML('vjUxbVgLUpvBYteyH9BSw7', { num, end: `50` }),
      first: {
        color: yellow,
        count: p_48,
        icon: (color) => <TriangleIcon fill={color || yellow} />,
        top: {
          color: yellow,
        },
        bottom: {
          color: yellow,
          text: WAIT_WITHDRAW
        }
      },
      second: {
        color: gray,
        count: 0,
        icon: (color) => <TriangleIcon fill={color || gray} />,
        top: {
          color: gray,
        },
        bottom: {
          color: gray,
          text: WAIT_WITHDRAW
        }
      }
    },
    // 阶段1-没有达到礼包3（50 USDT）奖励, 和 init 相比只差文案
    [MODE.phase_1]: {},
    // 阶段2-达到礼包3（50 USDT）奖励，没有达到礼包4（10000USDT）奖励
    [MODE.phase_2]: {
      title: (num) => _tHTML('s3wHFXyAjhEGLiYgiNVv1v', { num }),
      first: {
        color: green,
        count: 100,
        icon: (color) => <OkIcon fill={color || green} />,
        top: {
          color: green,
        },
        bottom: {
          color: green,
          text: WITHDRAWED
        }
      },
      second: {
        color: yellow,
        count: 90,
        icon: (color) => <TriangleIcon fill={color || yellow} />,
        top: {
          color: yellow,
        },
        bottom: {
          color: yellow,
          text: WAIT_WITHDRAW
        }
      }
    },
    // 阶段3 - 达到礼包4（10000 USDT）奖励
    [MODE.phase_3]: {
      title: _t('ooL2DuiGh6SebaGnQD1FJQ'),
      first: {
        color: green,
        count: 100,
        icon: (color) => <OkIcon fill={color || green} />,
        top: {
          color: green,
        },
        bottom: {
          color: green,
          text: WITHDRAWED
        }
      },
      second: {
        color: green,
        count: 100,
        icon: (color) => <OkIcon fill={color || green} />,
        top: {
          color: green,
        },
        bottom: {
          color: green,
          text: WITHDRAWED
        }
      }
    },
  }
  map.phase_1 = cloneDeep(map.init)

  return map
}

// 固定奖品id
export const AWARD_ID = {
  // 礼包 1 : 50 USDT 合约抵扣金
  ReferralBonusGift1: 'ReferralBonusGift1',
  // 礼包 2 : 50 USDT 合约体验金
  ReferralBonusGift2: 'ReferralBonusGift2',
  // 礼包 3 : 50 USDT提现
  ReferralBonusGift3: 'ReferralBonusGift3',
  // 礼包 4 : 10000 USDT大奖瓜分机会 (旅游)
  ReferralBonusGift4: 'ReferralBonusGift4',
  // vip 卷
  VIPLv1Trial: 'VIPLv1Trial'
}

export const getAwardsInfo = () => {
  const list = [
    {
      id: AWARD_ID.ReferralBonusGift1,
      url: futureUrl,
      label: _t('w2w5wvtgXwrKcDNzz2hLwo'),
      modal: MODAL_MAP.FUTURES_DEDUCTION_COUPON
    },
    {
      id: AWARD_ID.ReferralBonusGift2,
      url: futureTrailUrl,
      label: _t('xjQTErbhGVhR8BG3cG11Bp'),
      modal: MODAL_MAP.FUTURES_TRIAL_FUND
    },
    {
      id: AWARD_ID.ReferralBonusGift3,
      url: usdtUrl,
      label: _t('cXVp9UfApk6wVNWYfBxQra'),
      modal: MODAL_MAP.TOKEN
    },
    {
      id: AWARD_ID.ReferralBonusGift4,
      url: travelUrl,
      label: _t('t2nbJANUsKm17MVMA2ZF21'),
      modal: MODAL_MAP.TRAVEL_PACKAGE
    },
    {
      id: AWARD_ID.VIPLv1Trial,
      url: vipUrl,
      label: _t('eMmgX8xxGtxrjhdHQmTxC8'),
      modal: MODAL_MAP.VIP1_EXPERIENCE_TICKET
    }
  ]
  return list
}
