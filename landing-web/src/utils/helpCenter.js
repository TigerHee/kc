/**
 * Owner: terry@kupotech.com
 */
import HOST from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';

const { KUCOIN_HOST } = HOST || {};
/**
 * 通过帮助中心id生成support链接
 */
const  getHelpCenterLink = (id) => addLangToPath(`${KUCOIN_HOST}/support/${id}`);

const helpCenterMain = () => addLangToPath(`${KUCOIN_HOST}/support`);

export default getHelpCenterLink;
export {
  helpCenterMain
}