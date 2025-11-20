/**
 * Owner: vijay.zhou@kupotech.com
 */
import { post, postV2, pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const pull = pullWrapper(originPull);

/** KYB 信息查询 */
export const pullCompanyDetail = () => {
  return pull('/kyc/v3/company/detail');
};

/** 公司基本信息保存 */
export const postCompanyNormal = (params) => {
  return postV2({
    url: '/kyc/v2/company/normal/create-or-update',
    data: params,
    isJson: true,
  });
};

/** 公司联系人保存 */
export const postCompanyContact = (params) => {
  return postV2({
    url: '/kyc/v2/company/contact/create-or-update',
    data: params,
    isJson: true,
  });
};

/** 公司相关证书保存 */
export const postCompanyCredentials = (params) => {
  return postV2({
    url: '/kyc/v2/company/credentials/create-or-update',
    data: params,
    isJson: true,
  });
};

/** 公司附加信息保存 */
export const postCompanyAddition = (params) => {
  return postV2({
    url: '/kyc/v2/company/addition/create-or-update',
    data: params,
    isJson: true,
  });
};

/** 公司资料上传 */
export const upload = (params) => {
  return post('/kyc/v2/company/web/upload', params);
};

/** 公司资料删除 */
export const remove = (params) => {
  return post('/kyc/v2/company/web/deleteMaterial', params);
};

/** 提交审核 */
export const postCompanySubmit = () => {
  return post('/kyc/v2/company/submit');
};

/** 获取产业类型或商品类型的字典 */
export const pullDictByDictCodeListV2 = (params) => {
  return pull('/admin-center/inner/dict/query/byDictCodeListV2', params);
};
