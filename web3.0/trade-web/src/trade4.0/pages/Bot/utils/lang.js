/**
 * Owner: mike@kupotech.com
 */
import { _t as t, _tHTML as tHTML } from 'utils/lang';
import { getLangKey } from 'Bot/config';

/**
 * @description: 获取机器人语言key带有B_ 前缀
 * @param {*} key
 * @return {*}
 */
const _t = (key, variables) => {
  return t(getLangKey(key), variables);
};
const _tHTML = (key, variables) => {
  return tHTML(getLangKey(key), variables);
};
export { _t, _tHTML, t, tHTML };
