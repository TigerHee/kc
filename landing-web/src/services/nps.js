/*
 * @Owner: jesse.shao@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/nps';

// 问卷详情
export const surveyinfo = (params) => {
  return pull(`${prefix}/survey/info`, params, false, true);
};

// 问卷信息-预览
export const surveyinfopreview = (params) => {
  return pull(`${prefix}/survey/info/preview`, params, false, true);
};

export const surveysubmit = (params) => post(`${prefix}/survey/collection`, params, false, true);
