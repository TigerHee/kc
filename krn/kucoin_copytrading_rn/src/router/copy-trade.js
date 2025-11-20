import AccountTransfer from 'pages/AccountTransfer';
import AccountTransferHistory from 'pages/AccountTransfer/TransferHistory';
import ApplyTrader from 'pages/ApplyTrader';
import ApplySuccessResult from 'pages/ApplyTrader/ApplySuccessResult';
import FillApplyTraderForm from 'pages/ApplyTrader/FillApplyTraderForm';
import {ApplyTraderSelectAvatarPage} from 'pages/ApplyTrader/FillApplyTraderForm/pages/ApplyTraderSelectAvatarPage';
import FollowSetting from 'pages/FollowSetting';
import FollowSuccessResult from 'pages/FollowSetting/FollowSuccessResult';
import JoinTelegram from 'pages/JoinTelegram';
import LeadTradeReSign from 'pages/LeadTradeReSign';
import CopyTradeMain from 'pages/Main';
import MyEarnProfit from 'pages/MyEarnProfit';
import MyFollows from 'pages/MyFollows';
import MyTraderPositionSummary from 'pages/MyTraderPositionSummary';
import NickName from 'pages/ProfileSetting/NickName';
import Profile from 'pages/ProfileSetting/Profile';
import UndoIdentity from 'pages/ProfileSetting/UndoIdentity';
import UndoIdentitySuccessResult from 'pages/ProfileSetting/UndoIdentitySuccessResult';
import UpdateAvatar from 'pages/ProfileSetting/UpdateAvatar';
import TraderProfile from 'pages/TraderProfile';
import TraderSearch from 'pages/TraderSearch';

import {RouterNameMap} from 'constants/index';

//跟单页面 目前都增加多租户    activeBrandKeys: ['global', 'turkey', 'thailand'],
export const routerList = [
  //TODO: remove DEMO页面
  // {
  //   name: 'demo',
  //   component: Demo,
  //   sensorPageId: 'B20CopyTradeDemo',
  // },
  {
    name: RouterNameMap.CopyTradeMain,
    component: CopyTradeMain,
    sensorPageId: 'B20CopyTradeCopyTradeMain',
    active: config => config.route.CopyTradeMain,
  },

  {
    name: RouterNameMap.MyFollows,
    component: MyFollows,
    sensorPageId: 'B20CopyTradeMyFollows',
    active: config => config.route.MyFollows,
  },
  {
    name: RouterNameMap.JoinTelegram,
    component: JoinTelegram,
    sensorPageId: 'B20CopyTradeJoinTelegram',
    active: config => config.route.JoinTelegram,
  },
  {
    name: RouterNameMap.TraderSearch,
    component: TraderSearch,
    sensorPageId: 'B20CopyTradeTraderSearch',
    active: config => config.route.TraderSearch,
  },

  {
    name: RouterNameMap.FillApplyTraderForm,
    component: FillApplyTraderForm,
    sensorPageId: 'B20CopyTradeFillApplyTraderForm',
    active: config => config.route.FillApplyTraderForm,
  },
  {
    name: RouterNameMap.ApplyTraderSelectAvatarPage,
    component: ApplyTraderSelectAvatarPage,
    sensorPageId: 'B20CopyTradeApplyTraderSelectAvatarPage',
    active: config => config.route.ApplyTraderSelectAvatarPage,
  },
  {
    name: RouterNameMap.ApplyTrader,
    component: ApplyTrader,
    sensorPageId: 'B20CopyTradeApplyTrader',
    active: config => config.route.ApplyTrader,
  },
  {
    name: RouterNameMap.ApplySuccessResult,
    component: ApplySuccessResult,
    sensorPageId: 'B20CopyTradeApplySuccessResult',
    active: config => config.route.ApplySuccessResult,
  },

  // 我的分润 静态已完成
  {
    name: RouterNameMap.MyEarnProfit,
    component: MyEarnProfit,
    sensorPageId: 'B20CopyTradeMyEarnProfit',
    active: config => config.route.MyEarnProfit,
  },
  // 带单仓位页面
  {
    name: RouterNameMap.MyTraderPositionSummary,
    component: MyTraderPositionSummary,
    sensorPageId: 'B20CopyTradeMyTraderPositionSummary',
    active: config => config.route.MyTraderPositionSummary,
  },

  {
    name: RouterNameMap.FollowSetting,
    component: FollowSetting,
    sensorPageId: 'B20CopyTradeFollowSetting',
    active: config => config.route.FollowSetting,
  },
  // 跟单设置结果页
  {
    name: RouterNameMap.FollowSuccessResult,
    component: FollowSuccessResult,
    sensorPageId: 'B20CopyTradeFollowSuccessResult',
    active: config => config.route.FollowSuccessResult,
  },
  {
    name: RouterNameMap.TraderProfile,
    component: TraderProfile,
    sensorPageId: 'B20CopyTradeSelfTraderProfile',
    active: config => config.route.TraderProfile,
  },
  /** 修改用户昵称 */
  {
    name: RouterNameMap.NickName,
    component: NickName,
    sensorPageId: 'B20CopyTradeNickName',
    active: config => config.route.NickName,
  },
  /** 修改用户简介 */
  {
    name: RouterNameMap.Profile,
    component: Profile,
    sensorPageId: 'B20CopyTradeProfile',
    active: config => config.route.Profile,
  },
  /**修改头像*/
  {
    name: RouterNameMap.UpdateAvatar,
    component: UpdateAvatar,
    sensorPageId: 'B20CopyTradeUpdateAvatar',
    active: config => config.route.UpdateAvatar,
  },

  /** 划转资金 */
  {
    name: RouterNameMap.AccountTransfer,
    component: AccountTransfer,
    sensorPageId: 'B20CopyTradeAccountTransfer',
    active: config => config.route.AccountTransfer,
  },
  /** 划转历史 */
  {
    name: RouterNameMap.AccountTransferHistory,
    component: AccountTransferHistory,
    sensorPageId: 'B20CopyTradeAccountTransferHistory',
    active: config => config.route.AccountTransferHistory,
  },

  /** 撤销用户身份*/
  {
    name: RouterNameMap.UndoIdentity,
    component: UndoIdentity,
    sensorPageId: 'B20CopyTradeUndoIdentity',
    active: config => config.route.UndoIdentity,
  },
  /** 撤销用户身份成功结果页*/
  {
    name: RouterNameMap.UndoIdentitySuccessResult,
    component: UndoIdentitySuccessResult,
    sensorPageId: 'B20CopyTradeUndoIdentitySuccessResult',
    active: config => config.route.UndoIdentitySuccessResult,
  },

  /** 交易员重新签约协议页 */
  {
    name: RouterNameMap.LeadTradeReSign,
    component: LeadTradeReSign,
    sensorPageId: 'B20CopyTradeLeadTradeReSign',
    active: config => config.route.LeadTradeReSign,
  },
];
