/**
 * Owner: willen@kupotech.com
 */
// 资产证明接口
// 设计文档地址：https://wiki.kupotech.com/pages/viewpage.action?pageId=91337606
// 需求地址: https://wiki.kupotech.com/pages/viewpage.action?pageId=91329801
// UI地:
import { pull, postJson } from 'tools/request';
import { getNamespaceUrl } from 'tools/requestHandle';

const ASSET_FRONT = 'asset-front';
export const getUrl = getNamespaceUrl(ASSET_FRONT);

/**
 * 三方审计
 */
export const AuditTypeExternal = 'EXTERNAL';
/**
 * 内部审计
 */
export const AuditTypeInternal = 'INTERNAL';

// 资产证明主页接口

/**
 * 获取储备金信息
 */
export const getAssetReserve = () => {
  return pull(getUrl('/proof-of-reserves/asset-reserve'));
};

/**
 * 获取审计日期信息
 * @param {{
 *  auditType?: string, // 审计类型 EXTERNAL:第三方审计,INTERNAL:内部审计
 * }} params
 */
export const getAuditDateList = (params) => {
  return pull(getUrl('/proof-of-reserves/audit-date/list', params));
};
/**
 * 获取三方hashid/审计id
 * @param {
 *  uid: string,
 *  auditDate: number,
 *  autitType: string
 * } params
 */
const getHashId = (params) => {
  return pull(getUrl('/proof-of-reserves/audit-record/id', params));
};

/**
 * 获取系统内部hashID
 * @param {{
 *  uid: string,
 *  auditDate: number
 * }} params
 */
export const getSystemHashId = (params) => {
  return getHashId({ ...params, auditType: AuditTypeInternal });
};

/**
 * 获取三方hashID
 * @param {
 *  uid: string,
 *  auditDate: number
 * } params
 */
export const getThirdHashId = (params) => {
  return getHashId({ ...params, auditType: AuditTypeExternal });
};

// 资产证明详情也接口

/**
 * 获取内部审计详情
 * @param leafNodeId string
 */

export const getAuditRecordDetail = ({ leafNodeId }) => {
  return pull(getUrl('/proof-of-reserves/audit-record/detail', { leafNodeId }));
};

/**
 * merkle path
 * @param leafNodeId string
 */
export const downloadMerklePath = ({ leafNodeId }) => {
  return pull(getUrl('/proof-of-reserves/merkle-path/download', { leafNodeId }));
};
