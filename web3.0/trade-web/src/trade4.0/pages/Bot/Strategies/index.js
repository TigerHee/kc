/**
 * Owner: mike@kupotech.com
 */
/* eslint-disable import/no-dynamic-require */
import React, { lazy } from 'react';
import { strategiesMap } from 'Bot/config';

const getModule = (moduleName) => {
  return new Map([
    ['Create', require(`./${moduleName}/Create`).default],
    [
      'Detail',
      {
        Current: lazy(() =>
          import(/* webpackChunkName: "Bot_Current" */ `./${moduleName}/Detail/Current`),
        ),
        History: lazy(() =>
          import(/* webpackChunkName: "Bot_History" */ `./${moduleName}/Detail/History`),
        ),
        Paramater: lazy(() =>
          import(/* webpackChunkName: "Bot_Paramater" */ `./${moduleName}/Detail/Paramater`),
        ),
      },
    ],
    ['Running', require(`./${moduleName}/Running`).default],
    ['History', require(`./${moduleName}/History`).default],
    ['config', require(`./${moduleName}/config`)],
  ]);
};

// 所有策略配置
export const botCompEntryConfig = new Map([
  [strategiesMap.classicgrid, getModule('ClassicGrid')],
  [strategiesMap.futuregrid, getModule('FutureGrid')],
  [strategiesMap.martingale, getModule('Martingale')],
  [strategiesMap.futuremartingale, getModule('FutureMartingale')],
  [strategiesMap.infinitygrid, getModule('InfinityGrid')],
  [strategiesMap.automaticinverst, getModule('AutomaticInverst')],
  [strategiesMap.smarttrade, getModule('SmartTrade')],
  [strategiesMap.superai, getModule('SuperAI')],
  [strategiesMap.aispottrend, getModule('AiSpotTrend')],
  [strategiesMap.aifuturetrend, getModule('AiFutureTrend')],
  [strategiesMap.leverageGrid, getModule('LeverageGrid')],
  [strategiesMap.aiFutureBilater, getModule('AiFutureBilater')],
]);
/**
 * @description:  通过传递组件类型 获取对应的组件渲染
 * @prop {String} comp 组件区域类型
 * @return {JSXNode}
 */
export const useGetPart = ({ currentBot, part }) => {
  const currentBotComps = botCompEntryConfig.get(String(currentBot));
  const Module = currentBotComps?.get(part);
  return Module;
};
/**
 * @description:  通过传递组件类型 获取对应的组件渲染
 * @prop {String} comp 组件区域类型
 * @return {JSXNode}
 */
const StrategyPart = React.memo(({ currentBot, part, ...restProps }) => {
  const Module = useGetPart({ currentBot, part });
  if (!Module) {
    return null;
  }
  return <Module {...restProps} />;
});

export default StrategyPart;
