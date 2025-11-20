/**
 * Owner: tiger@kupotech.com
 */
import axios from 'axios';
import { omitBy } from 'lodash';
import { post, upload, get } from '@tools/request';
import { searchToJson } from './config';

const { CancelToken } = axios;
const prefix = '/compliance-center-flow';
const query = searchToJson();
const { clientUserId, operatorId, isKybProxy } = query;
let siteType = null;

export const setSiteType = (v) => {
  siteType = v;
};

const getQueryParams = () =>
  omitBy(
    { clientUserId, operatorId, isKybProxy: Boolean(isKybProxy), siteType },
    (value) => value === null || value === '',
  );

const postJson = (url, data, isForm, options) => {
  const queryParams = getQueryParams();
  return post(url, { ...queryParams, ...data }, isForm, options);
};

const complianceGet = (url, param) => {
  const queryParams = getQueryParams();
  return get(url, { ...queryParams, ...param });
};

// 给接口拼服务路径
export const postJsonWithPrefix = (url, param, options) => {
  return postJson(`${prefix}${url}`, param, false, options);
};

// 合规流程渲染数据
export async function GetComplianceFlow(param) {
  return postJson(`${prefix}/compliance/flow/render`, param, false, {
    timeout: 20000,
  });
}

// 发证国家
export async function GetCountry(param) {
  return postJson(`${prefix}/compliance/component/component_25/init`, param);
}

// 手机区号
export async function GetPhoneArea(param) {
  return postJson(`${prefix}/compliance/component/component_2/init`, param);
}

// 证件选择
export async function GetIDTypeList(param) {
  return postJson(`${prefix}/compliance/component/component_1/init`, param);
}

// 准备证件
export async function GetIdentityReadyData(param) {
  return postJson(`${prefix}/compliance/dynamic/page/page_0/init`, param);
}

// Jumio data
export async function GetJumioData(param) {
  return postJson(`${prefix}/compliance/page/page_1/init`, param, false, {
    timeout: 20000,
  });
}

// 提交页面
export async function GetResultData(param) {
  return postJson(`${prefix}/compliance/dynamic/page/page_7/init`, param);
}

// 上传
export async function fetchUploadFile(param) {
  const queryParams = getQueryParams();
  return upload(
    `${prefix}/compliance/component/file/upload`,
    { ...param, ...queryParams },
    {
      timeout: 60000,
      cancelToken: new CancelToken((c) => {
        window.fetchUploadCancel = c;
      }),
    },
  );
}

// 获取问卷数据
export async function getQuestionData(param) {
  return postJson(`${prefix}/compliance/dynamic/page/page_14/init`, param);
}

// 提交记分问卷获取评分
export async function fetchQuestionResult(param) {
  return postJson(`${prefix}/compliance/page/questionnaire/result`, param);
}

// 获取ndid节点选择
export async function getNdidData(param) {
  return postJson(`${prefix}/compliance/page/page_27/init`, param);
}

// 获取 NDID 倒计时
export async function getNdidTimerData(param) {
  return postJson(`${prefix}/compliance/page/page_28/init`, param);
}

// 取消 NDID 节点
export async function cancelNdidNode(param) {
  return postJson(`${prefix}/compliance/page/page_28/closeRequest`, param);
}

// 获取中台配置
export async function GetTransactionSettings(param) {
  return complianceGet(`${prefix}/compliance/transaction/context/query`, param);
}

// 获取 flow 配置
export async function getFlowConfig(param) {
  return postJson(`${prefix}/compliance/flow/config`, param);
}

// 页面元素通用查询接口
export async function getInitDataCommon(param) {
  return complianceGet(`${prefix}/compliance/page/page_common/init`, param);
}

// AU 问卷查询接口
export async function getQuestionnaireLookup(param) {
  return complianceGet(`${prefix}/compliance/page/questionnaire/lookup`, param);
}

// AU 问卷评卷接口
export async function postQuestionnaireEvaluate(param) {
  return postJson(`${prefix}/compliance/page/questionnaire/evaluate`, param);
}

// 获取文件链接
export async function getFilesUrl(param) {
  return postJson(`${prefix}/compliance/component/file/batch/download`, param);
}

// 获取 CRA 结果
export async function getCraResult(param) {
  return postJson(`${prefix}/compliance/page/craInfo/evaluate`, param);
}
