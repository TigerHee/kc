/**
 * Owner: iron@kupotech.com
 */
import { get, post } from '@tools/request';

// 查询封禁信息
// 入参支持多个bizType，以英文逗号分隔，如：IP_DIALOG, IP_TOP_MESSAGE, REGISTER
export const queryIpDismiss = (params) => get('/user-dismiss/ip-dismiss/notice', params);

// 查询英国地区封禁信息
export const queryEnglandDismiss = (params) =>
  get('/user-dismiss/ip-dismiss/notice/web/gb', params);

/**
 * 查询用户是否可以迁移
 * 
 * @returns Promise<{
      "success": true,
      "code": "200",
      "msg": "success",
      "retry": false,
      "data": {
        "canTransfer": false,
        "originalSiteType": "global",
        "targetSiteType": "australia",
        "targetRegion": "kyc",
        "subUserIdList": []
      }
    }> 
 */
export const queryUserCanTransfer = (params = {}) =>
  post('/user-dismiss-front/web/siteTransfer/userTransferNotice', params, true);
