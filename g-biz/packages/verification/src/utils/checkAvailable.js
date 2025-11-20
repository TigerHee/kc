/**
 * Owner: vijay.zhou@kupotech.com
 */
import { getAvailable as originGetAvailable } from '../services';
import withRetry from './withRetry';

/** 此接口需要有重试机制，跟app端协商为3次 */
const getAvailable = withRetry(originGetAvailable, 3);

/** 检查安全验证功能是否可用 */
export default async function checkAvailable(bizType) {
  try {
    const res = await getAvailable({ bizType });
    if (res.code === '200') {
      return res.data?.permitted ?? false;
    }
    throw new Error(res.msg);
  } catch (err) {
    console.error(err);
    return false;
  }
}
