/**
 * Owner: mike@kupotech.com
 */
import { getStrategiesDescription, whichStrategyByPath } from 'Bot/config';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';

export const strategyTypes = (machineMap) => {
  const isVisible = (id, _machineMap) => {
    // 接口数据没回来, 默认展示所有
    if (isEmpty(_machineMap)) {
      return true;
    }
    // 0:正常状态 1 表示隐藏，2 表示可见但不能创建
    return Number(_machineMap[id]?.limitStatus) !== 1;
  };
  // 过滤出能展示的策略
  const createStrategyMeta = (ids = []) => {
    return ids
      .map((id) => (isVisible(id, machineMap) ? getStrategiesDescription(id, false) : null))
      .filter((el) => !!el);
  };
  const allMeta = {
    gridStrategies: {
      index: 0,
      tag: ['Hot'],
      name: 'gridstrategy',
      note: 'gridstrategy.note',
      children: createStrategyMeta([1, 3, 10, 5]),
    },
    aiStrategies: {
      index: 1,
      tag: ['New'],
      name: 'aistrategy',
      note: 'aistrategy.note',
      children: createStrategyMeta([11, 13, 9, 8]),
    },
    avgStrategies: {
      index: 2,
      tag: [],
      name: 'avgstrategy',
      note: 'avgstrategy.note',
      children: createStrategyMeta([7, 12, 4, 2]),
    },
  };
  // 分类子元素为空, 就不展示该分类
  const filterMeta = {};
  Object.keys(allMeta).forEach((key) => {
    if (allMeta[key].children.length > 0) {
      filterMeta[key] = allMeta[key];
    }
  });
  return filterMeta;
};

export const tagEnum = {
  New: 'New',
  Hot: 'Hot',
};

/**
 * @description: 判断当前所在策略， 引导到合约类型策略使用
 * @param {*} templateType
 * @return {*}
 */
export const guideStrategyTemplateType = () => {
  const strategy = whichStrategyByPath(window.location);
  if (!strategy) return null;
  const templateType = strategy.id;
  const allMeta = strategyTypes();
  let guideTemplateType = 3;
  forEach(allMeta, ({ children }, key) => {
    const isIn = children.some((el) => el.id === templateType);
    if (isIn) {
      if (key === 'gridstrategy') {
        guideTemplateType = 3;
      } else if (key === 'aiStrategies') {
        guideTemplateType = 3;
      } else if (key === 'avgStrategies') {
        guideTemplateType = 12;
      }
    }
  });
  return guideTemplateType;
};
