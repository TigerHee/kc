/**
 * Owner: jesse.shao@kupotech.com
 */
import { showDateTimeByZone } from 'helper';
import { addLangToPath } from 'utils/lang';
import {
  PAKISTAN_CAMPAIGN_CODE,
  getHomeUrl,
  getLinkByScene,
} from 'components/$/MarketCommon/config';
import { searchToJson } from 'helper';
import { LANDING_HOST, LANDING_HOST_COM } from 'utils/siteConfig';
import bannerImg from 'assets/asianCarnival/banner.png';
import remainSvg from 'assets/asianCarnival/remain.svg';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

// banner 配置
export const BANNER_CONFIG = {
  pakistanCampaign: {
    activityName: PAKISTAN_CAMPAIGN_CODE,
    regToast: {
      NOT_START: {
        type: 'info',
        msg: 'The event has not started.',
      },
      OVER: {
        type: 'info',
        msg: 'The event has ended.',
      },
      SUCCESS: {
        type: 'success',
        msg: 'Joined',
      },
    },
    loginBackUrl: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/pakistan-campaign-trx${window.location.search}`),
    ),
    // title: 'KuCoin Pakistan Campaign: 120,000 TRX & an iPhone 13 Give Away! ',
    title: '120,000 TRX & an iPhone 13 Give Away! ',
    subTitle: '(Exclusive for Pakistani Users)',
    joinText: {
      true: 'Joined',
      false: 'Join Now',
    },
    shareText: 'Share Event',
    bannerBgImg: bannerImg,
    homeUrl: getHomeUrl(PAKISTAN_CAMPAIGN_CODE),
    shareUrl: inviteCode => {
      // rcode utm_source 存储在storage中
      const rcode = queryPersistence.getPersistenceQuery('rcode');
      const utm_source = queryPersistence.getPersistenceQuery('utm_source');
      return getLinkByScene({
        rcode: inviteCode,
        utm_source: PAKISTAN_CAMPAIGN_CODE,
        scene: 'share',
        needConvertedUrl: addLangToPath(
          `${LANDING_HOST_COM}/pakistan-campaign-trx?utm_source=${utm_source}&rcode=${rcode}`,
        ),
      });
    },
    utmSource: PAKISTAN_CAMPAIGN_CODE,
  },
};

// rules 文案
export const RULES_CONFIG = {
  pakistanCampaign: {
    title: 'Rules',
    content: [
      `1.${window._BRAND_NAME_} Existing Pakistani Users: Pakistani users registered from January 1, 2022 (UTC) until the campaign period and have not bought or deposited any crypto assets on ${window._BRAND_NAME_}.`,
      '2.Only the users who click "Join Now" are eligible to share the prize pool.',
      '3.Trading volume = Trading amount * Price.',
      '4.This event is only available for users in Pakistan.',
      '5.Internal transfers are not counted as deposits.',
      '6.Participants will earn rewards in proportion to their trading volume.',
      '7.The rewards will be distributed within 14 working days after the event ends.',
      '8.Rewards will not be issued to any duplicate or fake accounts found to have been cheating or engaging in any other fraudulent behavior.',
      `9.${window._BRAND_NAME_} reserves all rights to the final interpretation of the event.`,
    ],
  },
};

export const STATE_TEXT_CONFIG = {
  pakistanCampaign: {
    NOT_START: 'Coming Soon',
    IN_PROGRESS: 'In Progress',
    OVER: 'Ended',
  },
};

// 活动日期文案
export const TIME_TEXT_CONFIG = {
  pakistanCampaign: (startDate, endDate) => {
    const time1 = showDateTimeByZone(startDate, 'YYYY/MM/DD HH:mm:ss', 5);
    const time2 = showDateTimeByZone(endDate, 'YYYY/MM/DD HH:mm:ss', 5);

    return `Event Duration: ${time1} to ${time2} (UTC+5)`;
  },
};

// prize pool 文案
export const PRIZE_TEXT_CONFIG = {
  pakistanCampaign: {
    title: 'Prize Pool',
    remainImg: remainSvg,
    remain: num => `Remaining: ${num} TRX`,
  },
};

// 进度条配置
export const PRIZE_CONFIG = [
  {
    top: 0,
    percent: '0%',
  },
  {
    top: 10000,
    percent: '16%',
  },
  {
    top: 20000,
    percent: '32%',
  },
  {
    top: 30000,
    percent: '48%',
  },
  {
    top: 50000,
    percent: '64%',
  },
  {
    top: 70000,
    percent: '81%',
  },
  {
    top: 120000,
    percent: '100%',
  },
];
