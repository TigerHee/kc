/**
 * Owner: borden@kupotech.com
 */
import { pull } from 'utils/request';

/**
 * 获取nft token 信息
 * @param {string} symbolName
 */
export const getNftTokenInfo = (symbolName) => {
    return pull('/spot-nft/token/symbol', { symbolName });
};
