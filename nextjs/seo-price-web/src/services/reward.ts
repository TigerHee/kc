/**
 * Owner: willen@kupotech.com
 */
import { pull } from 'gbiz-next/request';


/**
 * 查询分享海报
 */
export async function querySharePosterConfig() {
  return pull('/growth-config/get/client/config/codes?businessLine=toc&codes=SharePosterTxt');
}
