import {isNil} from 'lodash';
import {getBaseCurrency} from 'site/tenant';

import {
  RANK_LIST_SORT_DESC_TYPE,
  SLIDE_ALLOW_UPPER_LIMIT_KEYS,
  SLIDE_UPPER_LIMIT_MAPS,
} from './TraderInfoListFilterBar/constant';

const CRITERIA_UNIT_MAP = {
  percent: '%',
  amount: getBaseCurrency(),
  days: 'days',
};

/**
 * 将驼峰命名法的字符串转换为下划线命名法
 * @param {string} str - 驼峰命名法的字符串
 * @returns {string} - 下划线命名法的字符串
 */
const camelToSnake = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertDaysAsLeader2Criteria = (days, operator = '>=') => {
  if (!days) return;
  return {
    field: camelToSnake('daysAsLeader'), // 带单时长
    op: operator,
    value: days,
    unit: CRITERIA_UNIT_MAP.days,
  };
};

export const generateCriteriaList = criteriaObjData => {
  let criteria = [];

  if (!criteriaObjData) {
    return criteria;
  }

  const {daysAsLeader} = criteriaObjData || {};
  if (!isNil(daysAsLeader)) {
    criteria.push(convertDaysAsLeader2Criteria(daysAsLeader));
  }

  Object.keys(SLIDE_ALLOW_UPPER_LIMIT_KEYS).forEach(key => {
    const field = SLIDE_ALLOW_UPPER_LIMIT_KEYS[key];
    const upperLimit = SLIDE_UPPER_LIMIT_MAPS[key];

    if (!criteriaObjData[field]) {
      return;
    }
    const [minValue, maxValue] = criteriaObjData[field];
    const unit =
      field === SLIDE_ALLOW_UPPER_LIMIT_KEYS.profitRate
        ? CRITERIA_UNIT_MAP.percent
        : CRITERIA_UNIT_MAP.amount;

    const formatField = camelToSnake(field);
    if (minValue === 0 && maxValue >= upperLimit) {
      criteria.push({
        unit,
        field: formatField,
        op: '>=',
        value: upperLimit,
      });
      return;
    }
    const betweenCriteriaList = [
      {
        unit,
        field: formatField,
        op: '>=',
        value: minValue,
      },
      maxValue !== upperLimit && {
        unit,
        field: formatField,
        op: '<=',
        value: maxValue,
      },
    ].filter(i => !!i);
    criteria.push(...betweenCriteriaList);
  });

  return criteria;
};

export const generateSort = sort => {
  if (!sort) {
    return;
  }

  return {
    field: camelToSnake(sort),
    // 带单规模：leadAmount，跟单者受益：followerPnl，当前跟单人数：currentCopyUserCount
    direction: RANK_LIST_SORT_DESC_TYPE.DESC, // 倒序排列（从大到小）
  };
};
export const generateRankListPayload = formValue => {
  const {sort, criteria = {}} = formValue;
  return {
    criteria: generateCriteriaList(criteria),
    sort: generateSort(sort),
    hideFull: !!criteria?.hideFull,
  };
};
