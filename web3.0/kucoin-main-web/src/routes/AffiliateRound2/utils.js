/**
 * Owner: alen.su@kupotech.com
 */
import { isNil } from 'lodash';
import { numberFixed, separateNumber } from 'src/helper';

/**
 * 人数展示
 * @param {*} value
 * @returns
 * 当确实无数据（用户为合伙人第1天或接口异常时），则展示为--
 * 其他情况则正常展示数字，0就是0
 */
export const renderAmount = (value) => {
  if (isNil(value)) {
    return '--';
  }
  let n = Number(value);
  if (Number.isNaN(n)) {
    return '--';
  }
  if (n === 0) {
    return 0;
  }
  return separateNumber(n);
};

/**
 * 金额展示
 * @param {*} value
 * @returns
 * USDT
 * 当确实无数据（用户为合伙人第1天或接口异常时），则展示为--
 * 其他情况则正常展示数字：当数字>=0.01时，固定保留2位小数展示，向下取整(5展示5.00)；
 * 当数字<0.01且>0时，展示<0.01；
 * 当数字=0时，展示0.00
 */
export const renderMoney = (value) => {
  if (isNil(value)) {
    return '--';
  }
  let n = Number(value);
  if (Number.isNaN(n)) {
    return '--';
  }

  if (n == 0) {
    return '0.00';
  }
  if (n < 0.01 && n > 0) {
    return '<0.01';
  }

  n = numberFixed(n, 2);

  return separateNumber(n);
};

export const MODAL_MAP = {
  DOWNLOAD_FILE: 'DOWNLOAD_FILE',
  // 异常兜底弹窗
  DATAERR: 'DATAERR',
  LOGIN_ERR: 'LOGIN_ERR',
  NO_AUTH: 'NO_AUTH',
  // 短弹窗
  YESTERDAY_COMMISSION: 'YESTERDAY_COMMISSION',
  THIS_WEEK_COMMISSION: 'THIS_WEEK_COMMISSION',
  // 有效新用户数
  EFFECTIVE_NEWUSERS: 'EFFECTIVE_NEWUSERS',
  // /累计交易量
  CUMULATIVE_VOLUME: 'CUMULATIVE_VOLUME',
  // 子返佣比例申请
  COMMISSION_RATE_APPLICATIONS: 'COMMISSION_RATE_APPLICATIONS',
  // 新人首月定级规则
  COUPLE_FIRST_GRADING_RULES: 'COUPLE_FIRST_GRADING_RULES',
  // 季度考核规则
  QUARTERLY_ASSESSMENT_RULES: 'QUARTERLY_ASSESSMENT_RULES',
  // 数据概览
  DATA_OVERVIEW: 'DATA_OVERVIEW',
  // 已邀请人数
  INVITED_PERSON_NUM: 'INVITED_PERSON_NUM',
  // 人均贡献返佣
  PERSON_REBATE: 'PERSON_REBATE',
  // 子合伙人
  SUBAFFILIATE_EXPLAIN: 'SUBAFFILIATE_EXPLAIN',
};
