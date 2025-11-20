/**
 * Owner: mike@kupotech.com
 */

const strategyModels = [
  require('Bot/Strategies/FutureGrid/model.js').default,
  require('Bot/Strategies/AutomaticInverst/model.js').default,
  require('Bot/Strategies/ClassicGrid/model.js').default,
  require('Bot/Strategies/InfinityGrid/model.js').default,
  require('Bot/Strategies/LeverageGrid/model.js').default,
  require('Bot/Strategies/FutureMartingale/model.js').default,
  require('Bot/Strategies/Martingale/model.js').default,
  require('Bot/Strategies/SuperAI/model.js').default,
  require('Bot/Strategies/AiFutureBilater/model.js').default,
  require('Bot/Strategies/AiSpotTrend/model.js').default,
  require('Bot/Strategies/AiFutureTrend/model.js').default,
  require('Bot/Strategies/SmartTrade/model.js').default,
];
// 机器人所有model
export default [
  require('./BotApp.js').default,
  require('./BotStrategyLists.js').default,
  require('./BotRunning.js').default,
  require('./BotHistory.js').default,
  require('./BotCoupon.js').default,
  require('./BotProfit.js').default,
  require('./BotStatus.js').default,
  ...strategyModels,
];
// 模块联邦需要的models
export const MF_Need_Models = [
  require('./BotMFInit.js').default,
  require('./BotApp.js').default,
  require('./BotRunning.js').default,
  require('./BotHistory.js').default,
  require('./BotCoupon.js').default,
  require('Bot/Strategies/SmartTrade/model.js').default,
];
