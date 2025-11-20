/**
 * Owner: john.zhang@kupotech.com
 */

import { post } from 'tools/request';

/**
 * 查询清退用户申领资产
 * @returns Promise<{
        "msg": "success",
        "code": "200",
        "data": [
              {
                "balance": 0,
                "currency": "string",  
                "claimStatus":"amount" //申领状态
              }
          ]
        "success": true,
        "retry": false
}>
 */
export async function getUserGuidanceAsset() {
  return post(`/user-dismiss-front/dismiss/user/asset-info`, {});
}

/**
 * 授权注册ZBX账号
 * @returns Promise<{
        "msg": "success",
        "code": "200",
        "data": "redirectUrl"
        "success": true,
        "retry": false
}>
 */
export async function autoRegisterZBXAccount() {
  return post(`/_api/user-dismiss-front/dismiss/user/auto/register`, {});
}

/**
 * 查询用户是否为清退用户
 * @returns Promise<{
        "msg": "success",
        "code": "200",
        "data": true
        "success": true,
        "retry": false
}>
 */
export async function checkIsNeedToGuide() {
  return post(`/user-dismiss-front/dismiss/is-dismiss-user`, {});
}

/**
 * 查询用户是否为清退用户
 * @returns Promise<{
        "msg": "success",
        "code": "200",
        "data": { redirectUrl:'', userId:'' }
        "success": true,
        "retry": false
}>
 */
export async function getUserZBXAccount() {
  return post(`/user-dismiss-front/dismiss/user/is/complete/register`, {});
}
