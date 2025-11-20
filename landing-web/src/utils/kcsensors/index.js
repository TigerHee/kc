/**
 * Owner: jesse.shao@kupotech.com
 */
import sensors from '@kc/sensors';
import { MAX_WIDTH } from 'config';
import { IS_TEST_ENV, _DEV_ } from '../env';

const siteId = window.screen.width < MAX_WIDTH ? 'kcH5' : 'kcWeb';

export const pageIdMap = {
  '/land/register': 'B1landRegister',
  '/land/register/r/:id': 'B1landRegisterR',
  '/land/spotlight/:id': 'B2SpotlightItem',
  '/land/spotlight_r5/:id': 'B5spotlightDetail',
  '/land/sign-up-rewards-campaign': 'B3LuckydrawTurkey', // 土耳其 luckydraw 活动
  '/land/referral-super-lucky-draw': 'B3Luckydraw',
  '/land/kucoin-asian-carnival-kok': 'B3AsianCarnival', // 亚洲kok活动
  '/land/sepa-lucky-draw': 'B3SepaLuckydraw', // 欧洲 luckydraw 活动
  '/land/gembox': 'B1gemboxError',
  '/land/treasure-coin-carnival': 'B3CoinCarnival', // 新币拉新活动
  '/land/turkey-summer-frenzy-tl': 'B3TurkeySummerFrenzy',
  '/land/pakistan-campaign-trx': 'B3PakistanCampaignTrx',
  '/land/promotion': 'B3Promotion',
  '/land/treasure-coin-carnival-r2': 'B3CoinCarnivalR2',
  '/land/prediction': 'B2Prediction', // 竞猜活动
  '/land/prediction/rule': 'B2Prediction', // 竞猜活动规则
  '/land/prediction/detail': 'B2Prediction', // 竞猜活动激活明细
  '/land/prediction/winner-list': 'B2Prediction',
  '/land/promotions/:path': 'B3LeGo', // 乐高
  '/land/promotions-preview/:path': 'B3LeGoPreview',
  '/land/nps/:path': 'B3Nps', // nps
  '/land/LearnToEarn': 'B2LearnToEarn', // NFT有奖答题活动页
  '/land/eth-merge': 'ETHMergeV1', // ETH Merge 1.0
  '/land/recall': 'B1recallVolume', // 流失召回
  '/land/lunc': 'LUNC0915',
  '/land/crypto-cup': 'B3FirstWorldCup',
  '/land/crypto-cup-my': 'B3CryptoCupMy',
  '/land/anti-phishing': 'B2AntiPhishing',
  '/land/assets/deposit-question': 'B2AssetsDepositQ',
  '/land/assets/withdraw-question': 'B2AssetsWithdrawQ',
  '/land/brand-broker': 'B2BrandBroker',
  '/land/choice/mobileInvitePage': 'B2ChoiceMobileInvite',
  '/land/choice/:id': 'B2ChoicePage',
  '/land/fee_discount_coupons/:symbol': 'B2FeeDiscountCoupons',
  '/land/guardian': 'B2Guardian',
  '/land/invite-friend': 'B2InviteFriend',
  '/land/kucoin-token': 'B2KucoinToken',
  '/land/kucoinlabs': 'B2KucoinLabs',
  '/land/kyc-video': 'B2KycVideo',
  '/land/leaderboard/:id': 'B2Leaderboard',
  '/land/nft-activity/:id': 'B2NftActivity',
  '/land/nft-info': 'B2NftInfo',
  '/land/security': 'B2Security',
  '/land/v3-landing': 'B2V3Landing',
  '/land/windvane': 'B2Windvane',

  '/land/activity/:path': 'B2Activity', // 运营活动模板
  '/land/activity-preview/:path': 'B2ActivityPreview',
  '/land/hotspot-news': 'B1HotnewsDetaill', // 热点新闻详情页
  '/land/invite': 'B2ActivityInvitee', // 运营活动-拉新裂变-被邀请人界面
  '/land/refer-friends-to-kucoin-and-win-free-travel': 'B3ReferralBonus', // 砍一刀 2023
  '/land/earn-crypto-rewards-by-referring': 'B3TocTokenGift', // 20230714 现金红包
  '/land/KuRewards': 'B2KuRewards', // 20230524 福利中心
  '/land/KuRewards/detail': 'B2KuRewardsP2', // 20230524 福利中心
  '/land/KuRewards/coupons': 'B2MyCoupons', // 20230524 福利中心
  '/land/wealth-calender/:id': 'B1economyDetail', // 20230624 财富日历详情页
  '/land/wealth-calender': 'B1economyData', // 20230624 财富日历列表页

  '/land/community-collect': 'B1Kucommunity', // 社群改版
  '/land/price-protect': 'B1PriceProtect'
};

const sensorsConfig = {
  env: _DEV_ || IS_TEST_ENV ? 'development' : 'production',
  abtest_url: `https://ab.kucoin.plus/api/v2/abtest/online/results?project-key=${
    IS_TEST_ENV || _DEV_ || process.env.NODE_ENV === 'development'
      ? '36DBB03C8F0BA07957A1210633E218AA72F82017'
      : '002DF87B8629B86AC8A602E685FF6EE4CDA5BB0F'
  }`,
  log: true,
};

function initHandler() {
  try {
    sensors.init(sensorsConfig);
    // saveSpmQueryParam2SessionStorage
    sensors.registerProject(
      {
        siteId,
        pageIdMap,
      },
      {
        app_name: _APP_NAME_,
      },
    );
    sensors.spmStorage.initSpmParam(window.location.href);
  } catch (e) {
    console.error(e);
  }
}

export default () => {
  initHandler();
};

export const KcSensorsLogin = (uid, userLevel) => {
  try {
    sensors.login(uid, userLevel);
  }
  catch (e) {
    console.log(e)
  }
};
