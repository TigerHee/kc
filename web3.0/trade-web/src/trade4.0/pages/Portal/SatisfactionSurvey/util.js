/**
 * Owner: harry.lai@kupotech.com
 */
import storage from 'utils/storage';
import {
  ExperienceOptions,
  SURVEY_DIRECTLY_CLOSE_COUNTER_STORAGE_KEY,
  SURVEY_HAS_SUBMIT_STORAGE_KEY,
} from './constant';

/**
 * 转换表单数据为埋点入参
 * @param {Object} values
 * @param {Array} values.selectedOptions
 * @param {string} values.otherContent
 * @param {number} values.score
 * @returns {Object}
 * @property {number[]} optionIndexes
 * @property {string} otherContent
 * @property {string} score
 */
export const convertFormValues2TrackPayload = (values) => {
  const { selectedOptions, ...others } = values;
  const optionIndexes = selectedOptions
    ?.map((i) => ExperienceOptions.findIndex((item) => item.value === i))
    .join(',');

  return {
    optionIndexes,
    ...others,
  };
};

const HAS_SUBMIT_VAL = 'true';

const DEFAULT_DIRECTLY_CLOSE_COUNTER = 0;
/** 直接关闭不出弹窗 最大阈值 */
const LIMIT_MAX_DIRECTLY_CLOSE_COUNTER = 2;

export class SurveyShowController {
  /** 是否出调查弹窗 */
  static canShow() {
    const hasBeenSubmitted = storage.getItem(SURVEY_HAS_SUBMIT_STORAGE_KEY) === HAS_SUBMIT_VAL;
    const isLimitDirectlyClose =
      storage.getItem(SURVEY_DIRECTLY_CLOSE_COUNTER_STORAGE_KEY) >=
      LIMIT_MAX_DIRECTLY_CLOSE_COUNTER;

    // 未提交表单 与 关闭次数没超过阈值
    return !hasBeenSubmitted && !isLimitDirectlyClose;
  }

  /** 状态设为已提交 */
  static setIsSubmit() {
    storage.setItem(SURVEY_HAS_SUBMIT_STORAGE_KEY, HAS_SUBMIT_VAL);
  }

  static getDirectlyCloseCounter() {
    return (
      parseInt(storage.getItem(SURVEY_DIRECTLY_CLOSE_COUNTER_STORAGE_KEY), 10) ||
      DEFAULT_DIRECTLY_CLOSE_COUNTER
    );
  }

  /** 累加直接关闭调研弹窗计数器 */
  static addOneDirectlyCloseCounter() {
    const current = this.getDirectlyCloseCounter();
    storage.setItem(SURVEY_DIRECTLY_CLOSE_COUNTER_STORAGE_KEY, current + 1);
  }
}
