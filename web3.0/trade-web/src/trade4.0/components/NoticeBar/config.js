/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui';
import etfNoti from '@/assets/leveraged-tokens/etfNoti.svg';
import bonusLoansNoti from '@/assets/margin/bonus-loans-noti.svg';
import marginSettleNoti from '@/assets/margin/force-settle-noti.svg';
import marginBonusNoti from '@/assets/margin/icon-mail.svg';
import marginDangerNoti from '@/assets/margin/margin-danger-noti.svg';
import marginInfoNoti from '@/assets/margin/margin-info-noti.svg';
import marginWarningNoti from '@/assets/margin/margin-warning-noti.svg';
import CancelledVoice from '@/assets/otc/otc_voice/cancelled.mp3';
import CancelledCNVoice from '@/assets/otc/otc_voice/cancelled_cn.mp3';
import NewOrderVoice from '@/assets/otc/otc_voice/new_order.mp3';
import NewOrderCNVoice from '@/assets/otc/otc_voice/new_order_cn.mp3';
import PaidVoice from '@/assets/otc/otc_voice/paid.mp3';
import PaidCNVoice from '@/assets/otc/otc_voice/paid_cn.mp3';
import ReceivedVoice from '@/assets/otc/otc_voice/received.mp3';
import ReceivedCNVoice from '@/assets/otc/otc_voice/received_cn.mp3';
import { addLangToPath } from 'utils/lang';
import { siteCfg } from 'config';
import SvgIcon from '../KCSvgIcon';

const push = (path) => {
  window.location.href = path;
};

const _symbol = s => (s || '').replace('/', '-');
const linkToTrade = (context, dispatch) => {
  const symbol = _symbol(context?.symbol);
  dispatch({
    type: '$tradeKline/routeToSymbol',
    payload: { symbol },
  });
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => props.theme.colors.primary};
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 12px;
      height: 12px;
    }
  }
`;

const { LANDING_HOST } = siteCfg;
// 前往任务中心首页
const TASK_CENTER = addLangToPath(`${LANDING_HOST}/KuRewards`);
// 前往任务中心-累计充值tab
const TASK_CENTER_DEPOSIT = addLangToPath(`${LANDING_HOST}/KuRewards?tab1=basic&tab2=deposit`);

export const TYPE_MAP = {
  _default: {
    // message: '',
    // description: '',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    // 跳转地址 webActionUrl 配置存在情况，优先级高使用此 hookClick
    hookClick: (context, dispatch, webActionUrl) => {
      if (webActionUrl) {
        if (webActionUrl?.[0] === '/') {
          push(webActionUrl);
        } else {
          const newWindow = window.open(webActionUrl);
          newWindow.opener = null;
        }
      }
    },
  },
  'notification.risen.to': {
    // message: '价格上涨预警通知',
    // description: 'KCS/BTC已涨至0.001。',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: linkToTrade,
  },
  'notification.fell.to': {
    // message: '价格下跌预警通知',
    // description: 'KCS/BTC已涨至0.001。',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: linkToTrade,
  },
  'notification.download': {
    // message: '离线下载',
    // description: '交易记录已生成，请下载。',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="download" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/account/download');
    },
  },
  'quotes.push.symbol.up': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: linkToTrade,
  },
  'quotes.push.symbol.down': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: linkToTrade,
  },
  'quotes.push.symbol.volatility': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: linkToTrade,
  },
  '1.payment.rollback_deposited': {
    // message: '重新上账',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="monetization" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/record');
    },
  },
  '1.payment.rollback_pay_bill': {
    // message: '归还欠款',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="monetization" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/record');
    },
  },
  '1.payment.rollback_completed': {
    // message: '发生回滚-不欠帐',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="monetization" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/record');
    },
  },
  '1.payment.rollback_completed_arrears': {
    // message: '发生回滚-欠帐',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="monetization" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/record');
    },
  },
  'notification.deposit': {
    // message: '资产到账',
    // description: '您的0.1234BTC已到账。',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="monetization" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/record');
    },
  },
  'notification.deposit.old.address': {
    // message: '资产到账-旧地址',
    // description: '您的0.1234BTC已到账。',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="monetization" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/record');
    },
  },
  'notification.login': {
    // message: '多端登录',
    // description: '您的账号在另一个设备登录',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="group" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/account');
    },
  },
  'notice.custom': {
    // message: '系统公告',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: (context) => {
      // target:跳转链接，根据运营配置，如果未配置则无该字段
      const { target } = context;
      if (target) {
        const newWindow = window.open(target);
        newWindow.opener = null;
      }
    },
  },
  'verification.notice.new.order': {
    // message: '场外交易',
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: (context) => {
      const { orderId } = context;
      if (orderId) {
        push(`/otc/user/orders/${orderId}`);
      }
    },
  },
  'notification.margin-enable-margin': {
    // message: '开通杠杆交易',
    icon: (
      <IconWrapper>
        <img src={marginInfoNoti} alt="" />
      </IconWrapper>
    ),
    // hookClick: (context) => {
    //   const { orderId } = context;
    //   if (orderId) {
    //     push(`/otc/user/orders/${orderId}`);
    //   }
    // },
  },
  'notification.margin-liquidation-alert': {
    // message: '爆仓预警',
    icon: (
      <IconWrapper>
        <img src={marginWarningNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/margin-account');
    },
  },
  'notification.margin-liquidate-repay': {
    // message: '强平还款',
    icon: (
      <IconWrapper>
        <img src={marginSettleNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/margin-account');
    },
  },
  'notification.margin-negative-balance': {
    // message: '穿仓',
    icon: (
      <IconWrapper>
        <img src={marginDangerNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/margin/borrow');
    },
  },
  'notification.margin-liquidation': {
    // message: '爆仓',
    icon: (
      <IconWrapper>
        <img src={marginDangerNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/margin/borrow');
    },
  },
  // 用户放币（对方已放币）
  'verification.notice.sellers.put.money': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/otc/user/orders');
    },
  },
  // 用户已付款（对方标记“已完成付款”）
  'verification.notice.buyer.payment': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/otc/user/orders');
    },
  },
  'verification.notice.cancle.order': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/otc/user/orders');
    },
  },
  'verification.notice.seller.order': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="clock" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/otc/user/orders');
    },
  },
  'notification.target-lend-publish': {
    icon: (
      <IconWrapper>
        <img src={bonusLoansNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/bonus/loans');
    },
  },
  'notification.margin-subscription-success': {
    icon: (
      <IconWrapper>
        <img src={etfNoti} alt="" />
      </IconWrapper>
    ),
  },
  'notification.margin-redemption-success': {
    icon: (
      <IconWrapper>
        <img src={etfNoti} alt="" />
      </IconWrapper>
    ),
  },
  'notification.margin-subscription-failed': {
    icon: (
      <IconWrapper>
        <img src={etfNoti} alt="" />
      </IconWrapper>
    ),
  },
  'notification.margin-redemption-failed': {
    icon: (
      <IconWrapper>
        <img src={etfNoti} alt="" />
      </IconWrapper>
    ),
  },
  // 广告下架
  'notification.otc.sell.ad.balance.limit': {
    icon: (
      <IconWrapper>
        <img src={marginWarningNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/otc/user/ads?s=1');
    },
  },
  'notification.otc.buy.ad.balance.limit': {
    icon: (
      <IconWrapper>
        <img src={marginWarningNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/otc/user/ads?s=1');
    },
  },
  'notification.margin-bonus.bonus-send': {
    icon: (
      <IconWrapper>
        <img src={marginBonusNoti} alt="" />
      </IconWrapper>
    ),
    hookClick: () => {
      push('/assets/bonus/margin-bonus');
    },
  },
  // 任务中心，注册成功-minica
  'platform.markting.newcomer.register': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: () => {
      window.location.href = addLangToPath(`${LANDING_HOST}/KuRewards?type=newcomerGuide`);
    },
  },
  // 任务中心，注册成功3天内没有充值/入金行为-minica
  'platform.markting.deposit.advertisement': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: () => {
      window.location.href = TASK_CENTER_DEPOSIT;
    },
  },
  // 任务中心，累计充值满门槛值（接口传递）（只针对报名）报名之后，自动发奖的那一部分用户-minica
  'platform.markting.finish.accumulative.deposit': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: () => {
      window.location.href = TASK_CENTER_DEPOSIT;
    },
  },
  // 任务中心，提交提现申请-minica
  'platform.markting.withdraw.application': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: () => {
      window.location.href = TASK_CENTER;
    },
  },
  // 任务中心，提交提现申请-minica
  'platform.markting.withdraw.application.passed': {
    icon: (
      <IconWrapper>
        <SvgIcon iconId="horn" />
      </IconWrapper>
    ),
    hookClick: () => {
      window.location.href = TASK_CENTER;
    },
  },
};

// 商家侧的提示音状态
export const VOICE_MAP = {
  'verification.notice.new.order': {
    // 新订单
    zh_CN: NewOrderCNVoice,
    en_US: NewOrderVoice,
  },
  'verification.notice.cancle.order': {
    // 取消订单
    zh_CN: CancelledCNVoice,
    en_US: CancelledVoice,
  },
  'verification.notice.buyer.payment': {
    // 用户买币，已付款
    zh_CN: PaidCNVoice,
    en_US: PaidVoice,
  },
  'verification.notice.sellers.put.money': {
    // 用户卖币，用户已放币
    zh_CN: ReceivedCNVoice,
    en_US: ReceivedVoice,
  },
};
