/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-03-03 15:29:42
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-11 12:25:02
 * @FilePath: /public-web/src/services/gemspace.js
 * @Description:
 */
import { post as originPost, pull } from 'tools/request';

const post = (url, data) => {
  return originPost(url, data, false, true);
};
const nameSpace = '/currency-front';

/**
 * 查询banner
 * @returns
 */
export async function pullGemspaceBanner() {
  return pull(`${nameSpace}/gem/customer/banner`);
}

/**
 * 查询newListing
 * @returns
 */
export async function pullGemspaceNewListing() {
  return pull(`${nameSpace}/gem/customer/newListing`);
}

/**
 * 查询ongoingGem
 * @returns
 */
export async function pullGemspaceOngoingGem() {
  return pull(`${nameSpace}/gem/customer/ongoingGem`);
}
