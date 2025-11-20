/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回所有合约交易对信息
 */

export const getPrefixTopic = (topic) => {
  if (!topic) return '';
  return topic.split(':')?.[1] || '';
};
