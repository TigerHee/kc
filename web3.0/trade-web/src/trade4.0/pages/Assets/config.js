/**
 * Owner: Ray.Lee@kupotech.com
 */
import { createContext } from 'react';
// wrapper context
export const WrapperContext = createContext('');

// 组件名称
export const name = 'assets';
// resize 宽高
export const eventName = `screen_${name}_change`;

// 账户资产余额变化Topic
export const topicName = '/account/snapshotBalanceFrequency500';
// export const topicName = '/account/snapshotBalance';
