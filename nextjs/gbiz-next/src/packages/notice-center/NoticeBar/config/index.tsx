/**
 * Owner: willen@kupotech.com
 */
import includes from 'lodash-es/includes';
import HornSvg from '../../static/svg_icons/horn.svg';
import ClockSvg from '../../static/svg_icons/clock.svg';
import DownloadSvg from '../../static/svg_icons/download.svg';
import GroupSvg from '../../static/svg_icons/group.svg';
import MonetizationSvg from '../../static/svg_icons/monetization.svg';
import NotificationSvg from '../../static/svg_icons/notifications.svg';
import etfNoti from '../../static/leveraged-tokens/etfNoti.svg';
import bonusLoansNoti from '../../static/margin/bonus-loans-noti.svg';
import marginSettleNoti from '../../static/margin/force-settle-noti.svg';
import marginBonusNoti from '../../static/margin/icon-mail.svg';
import marginDangerNoti from '../../static/margin/margin-danger-noti.svg';
import marginInfoNoti from '../../static/margin/margin-info-noti.svg';
import marginWarningNoti from '../../static/margin/margin-warning-noti.svg';
import CancelledVoice from '../../static/otc_voice/cancelled.mp3';
import CancelledCNVoice from '../../static/otc_voice/cancelled_cn.mp3';
import NewOrderVoice from '../../static/otc_voice/new_order.mp3';
import NewOrderCNVoice from '../../static/otc_voice/new_order_cn.mp3';
import PaidVoice from '../../static/otc_voice/paid.mp3';
import PaidCNVoice from '../../static/otc_voice/paid_cn.mp3';
import ReceivedVoice from '../../static/otc_voice/received.mp3';
import ReceivedCNVoice from '../../static/otc_voice/received_cn.mp3';
import addLangToPath from 'tools/addLangToPath';
import linkToTrade from '../../utils/linkToTrade';
import evtEmitter from '../../utils/evtEmitter';
import { getSiteConfig } from 'kc-next/boot';
import { useRouter } from 'kc-next/compat/router';
import styles from './styles.module.scss';

const _symbol = s => (s || '').replace('/', '-');
// 充提Event
const changeCurrencyEvent = evtEmitter.getEvt('assetsNoticeSubscribe');

/**
 * 没在充提界面，直接更新路由
 * 若就在充提界面内，需要通过事件，进行币种切换
 * @param {*} url
 * @param {*} param1
 * @returns
 */
interface AssetRedirectParams {
  type?: 'deposit' | 'withdraw';
  currency?: string;
}
const assetRedirect = (url: string, { type, currency }: AssetRedirectParams = {}) => {
  const router = useRouter();
  const isCurrentPage = includes(window?.location?.pathname, type === 'deposit' ? '/assets/coin' : '/assets/withdraw');
  if (!isCurrentPage) {
    process.env.LEGACY ? window.noticePushTo?.(url) : router?.push(url);
    return;
  }
  const evtName = type === 'deposit' ? 'noticeDepositRecover' : 'noticeWithDrawRecover';
  changeCurrencyEvent?.emit(evtName, { currency });
};

function IconWrapper({ children }: { children: React.ReactNode }) {
  return <div className={styles.IconWrapper}>{children}</div>;
}

function SvgIcon({ src, alt }: { src: string; alt?: string }) {
  return <img src={src} className={styles.SvgIcon} alt={alt || 'notice-icon'} width={16} height={16} />;
}

export const TYPE_MAP = (push: (url: string) => void) => {
  return {
    _default: {
      // message: '',
      // description: '',
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      // 跳转地址 webActionUrl 配置存在情况，优先级高使用此 hookClick
      hookClick: (context, webActionUrl) => {
        if (webActionUrl) {
          if (webActionUrl?.[0] === '/') {
            push?.(webActionUrl);
          } else {
            const newWindow = window.open(webActionUrl);
            if (newWindow && newWindow.opener) {
              if (newWindow) newWindow.opener = null;
            }
          }
        }
      },
    },
    'notification.risen.to': {
      // message: '价格上涨预警通知',
      // description: 'KCS/BTC已涨至0.001。',
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { symbol } = context;
        linkToTrade(_symbol(symbol));
      },
    },
    'notification.fell.to': {
      // message: '价格下跌预警通知',
      // description: 'KCS/BTC已涨至0.001。',
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { symbol } = context;
        linkToTrade(_symbol(symbol));
      },
    },
    'notification.download': {
      // message: '离线下载',
      // description: '交易记录已生成，请下载。',
      icon: (
        <IconWrapper>
          <SvgIcon src={DownloadSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/account/download');
      },
    },
    'quotes.push.symbol.up': {
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { symbol } = context;
        linkToTrade(_symbol(symbol));
      },
    },
    'quotes.push.symbol.down': {
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { symbol } = context;
        linkToTrade(_symbol(symbol));
      },
    },
    'quotes.push.symbol.volatility': {
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { symbol } = context;
        linkToTrade(_symbol(symbol));
      },
    },
    '1.payment.rollback_deposited': {
      // message: '重新上账',
      icon: (
        <IconWrapper>
          <SvgIcon src={MonetizationSvg} />
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
          <SvgIcon src={MonetizationSvg} />
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
          <SvgIcon src={MonetizationSvg} />
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
          <SvgIcon src={MonetizationSvg} />
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
          <SvgIcon src={MonetizationSvg} />
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
          <SvgIcon src={MonetizationSvg} />
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
          <SvgIcon src={GroupSvg} />
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
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        // target:跳转链接，根据运营配置，如果未配置则无该字段
        const { target } = context;
        if (target) {
          const newWindow = window.open(target);
          if (newWindow && newWindow.opener) {
            if (newWindow) newWindow.opener = null;
          }
        }
      },
    },
    'verification.notice.new.order': {
      // message: '场外交易',
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
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
          <SvgIcon src={marginInfoNoti} />
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
          <SvgIcon src={marginWarningNoti} />
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
          <SvgIcon src={marginSettleNoti} />
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
          <SvgIcon src={marginDangerNoti} />
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
          <SvgIcon src={marginDangerNoti} />
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
          <SvgIcon src={ClockSvg} />
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
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/otc/user/orders');
      },
    },
    'verification.notice.cancle.order': {
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/otc/user/orders');
      },
    },
    'verification.notice.seller.order': {
      icon: (
        <IconWrapper>
          <SvgIcon src={ClockSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/otc/user/orders');
      },
    },
    'notification.target-lend-publish': {
      icon: (
        <IconWrapper>
          <SvgIcon src={bonusLoansNoti} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/assets/bonus/loans');
      },
    },
    'notification.margin-subscription-success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={etfNoti} />
        </IconWrapper>
      ),
    },
    'notification.margin-redemption-success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={etfNoti} />
        </IconWrapper>
      ),
    },
    'notification.margin-subscription-failed': {
      icon: (
        <IconWrapper>
          <SvgIcon src={etfNoti} />
        </IconWrapper>
      ),
    },
    'notification.margin-redemption-failed': {
      icon: (
        <IconWrapper>
          <SvgIcon src={etfNoti} />
        </IconWrapper>
      ),
    },
    // 广告下架
    'notification.otc.sell.ad.balance.limit': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/otc/user/ads?s=1');
      },
    },
    'notification.otc.buy.ad.balance.limit': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/otc/user/ads?s=1');
      },
    },
    'notification.margin-bonus.bonus-send': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginBonusNoti} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/assets/bonus/margin-bonus');
      },
    },
    'notification.margin-bonus.isolated-bonus-send': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginBonusNoti} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/assets/bonus/margin-bonus');
      },
    },
    'notification.margin-bonus.bonus-not-receive': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginBonusNoti} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/assets/bonus/margin-bonus');
      },
    },
    // 赠金未交易通知
    'notification.margin-bonus.bonus-not-trade': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { target } = context;
        if (target) {
          const newWindow = window.open(target);
          if (newWindow && newWindow.opener) {
            if (newWindow) newWindow.opener = null;
          }
        }
      },
    },
    // 赠金首次交易通知
    'notification.margin-bonus.bonus-first-trade': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { target } = context;
        if (target) {
          const newWindow = window.open(target);
          if (newWindow && newWindow.opener) {
            if (newWindow) newWindow.opener = null;
          }
        }
      },
    },
    // 法币交易-信用卡买币成功
    'deposit.notice.bank.card.trade.success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/fast-coin/order/${orderId}?from=bank_card&orderStatus=1`);
        }
      },
    },
    // 法币交易-信用卡买币失败
    'deposit.notice.bank.card.trade.fail': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/fast-coin/order/${orderId}?from=bank_card&orderStatus=2`);
        }
      },
    },
    // 法币交易-余额买币成功
    'deposit.notice.balance.trade.success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/fast-coin/order-details/${orderId}?from=balance&orderStatus=1`);
        }
      },
    },
    // 法币交易-余额买币失败
    'deposit.notice.balance.trade.fail': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/fast-coin/order-details/${orderId}?from=balance&orderStatus=2`);
        }
      },
    },
    // 法币交易-法币充值成功
    'deposit.notice.bank.card.recharge.success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/assets/fiat-currency/recharge/detail/${orderId}?orderType=RECHARGE&orderStatus=1`);
        }
      },
    },
    // 法币交易-法币充值失败
    'deposit.notice.bank.card.recharge.fail': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/assets/fiat-currency/recharge/detail/${orderId}?orderType=RECHARGE&orderStatus=2`);
        }
      },
    },
    // 法币交易-sepa充值成功
    'deposit.notice.bank.transfer.deposit.success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/assets/fiat-currency/recharge/detail/${orderId}?orderType=RECHARGE&orderStatus=1`);
        }
      },
    },
    // 法币交易-sepa充值失败
    'deposit.notice.bank.transfer.deposit.fail': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { orderId } = context;
        if (orderId) {
          push(`/assets/fiat-currency/recharge/detail/${orderId}?orderType=RECHARGE&orderStatus=2`);
        }
      },
    },
    // 法币充值渠道kyc认证成功通知
    'deposit.notice.kyc.success': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: handleDepositKycHookClick,
    },
    // 法币充值渠道kyc认证失败通知
    'deposit.notice.kyc.fail': {
      icon: (
        <IconWrapper>
          <SvgIcon src={marginWarningNoti} />
        </IconWrapper>
      ),
      hookClick: handleDepositKycHookClick,
    },
    // 任务中心，注册成功-minica
    'platform.markting.newcomer.register': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        const { LANDING_HOST } = getSiteConfig();
        window.location.href = addLangToPath(`${LANDING_HOST}/KuRewards?type=newcomerGuide`);
      },
    },
    // 任务中心，注册成功3天内没有充值/入金行为-minica
    'platform.markting.deposit.advertisement': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        const { LANDING_HOST } = getSiteConfig();
        // 前往任务中心-累计充值tab
        const TASK_CENTER_DEPOSIT = addLangToPath(`${LANDING_HOST}/KuRewards?tab1=basic&tab2=deposit`);
        window.location.href = TASK_CENTER_DEPOSIT;
      },
    },
    // 任务中心，累计充值满门槛值（接口传递）（只针对报名）报名之后，自动发奖的那一部分用户-minica
    'platform.markting.finish.accumulative.deposit': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        const { LANDING_HOST } = getSiteConfig();
        // 前往任务中心-累计充值tab
        const TASK_CENTER_DEPOSIT = addLangToPath(`${LANDING_HOST}/KuRewards?tab1=basic&tab2=deposit`);
        window.location.href = TASK_CENTER_DEPOSIT;
      },
    },
    // 任务中心，提交提现申请-minica
    'platform.markting.withdraw.application': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        const { LANDING_HOST } = getSiteConfig();
        // 前往任务中心首页
        const TASK_CENTER = addLangToPath(`${LANDING_HOST}/KuRewards`);
        window.location.href = TASK_CENTER;
      },
    },
    // 任务中心，提交提现申请-minica
    'platform.markting.withdraw.application.passed': {
      icon: (
        <IconWrapper>
          <SvgIcon src={HornSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        const { LANDING_HOST } = getSiteConfig();
        // 前往任务中心首页
        const TASK_CENTER = addLangToPath(`${LANDING_HOST}/KuRewards`);
        window.location.href = TASK_CENTER;
      },
    },
    // 提现到账成功
    'notification.withdraw.success.v2': {
      // message: '提现',
      // description: '您已在xxxx时间成功提现 xxx USDT',
      icon: (
        <IconWrapper>
          <SvgIcon src={MonetizationSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/assets/record?category=withDraw');
      },
    },
    // 提现到账失败
    'notification.withdraw.unsuccess.v2': {
      // message: '提现',
      // description: '您在xxxx时间提现失败 xxx USDT，请联系客服',
      icon: (
        <IconWrapper>
          <SvgIcon src={MonetizationSvg} />
        </IconWrapper>
      ),
      hookClick: () => {
        push('/assets/record?category=withDraw');
      },
    },
    /* 币种开启充值 */
    'notification.currency.open.deposit': {
      icon: (
        <IconWrapper>
          <SvgIcon src={NotificationSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { currency } = context || {};
        if (currency) {
          assetRedirect(`/assets/coin/${currency}?spm=kcWeb.noticeSub.deposit.currency`, {
            type: 'deposit',
            currency,
          });
        }
      },
    },
    /* 币链开启充值 */
    'notification.currency-chain.open.deposit': {
      icon: (
        <IconWrapper>
          <SvgIcon src={NotificationSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { currency } = context || {};
        if (currency) {
          assetRedirect(`/assets/coin/${currency}?spm=kcWeb.noticeSub.deposit.chain`, {
            type: 'deposit',
            currency,
          });
        }
      },
    },
    /* 币种开启提现 */
    'notification.currency.open.withdraw': {
      icon: (
        <IconWrapper>
          <SvgIcon src={NotificationSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { currency } = context || {};
        if (currency) {
          assetRedirect(`/assets/withdraw/${currency}?spm=kcWeb.noticeSub.withdraw.currency`, {
            type: 'withdraw',
            currency,
          });
        }
      },
    },
    /* 币链开启提现 */
    'notification.currency-chain.open.withdraw': {
      icon: (
        <IconWrapper>
          <SvgIcon src={NotificationSvg} />
        </IconWrapper>
      ),
      hookClick: context => {
        const { currency } = context || {};
        if (currency) {
          assetRedirect(`/assets/withdraw/${currency}?spm=kcWeb.noticeSub.withdraw.chain`, {
            type: 'withdraw',
            currency,
          });
        }
      },
    },
  };
};

// 法币充值渠道kyc通知点击时的事件
function handleDepositKycHookClick(context: any, webhookUrl: string, push: (url: string) => void) {
  const { fiatCurrency, channelId, scene = 'deposit' } = context;
  if (fiatCurrency && channelId) {
    const isDeposit = scene === 'deposit';
    push(
      `/assets/fiat-currency/${isDeposit ? 'recharge' : 'withdraw'}?fiatCurrency=${fiatCurrency}&${
        isDeposit ? 'channel_id' : 'channelId'
      }=${channelId}`
    );
  }
}

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
