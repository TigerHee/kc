/**
 * Owner: iron@kupotech.com
 */
let uid = '';
let vip_level = '';

export const getUid = () => uid;
export const getVipLevel = () => vip_level;
export const setUid = (id) => {
  uid = id;
};
export const setVipLevel = (level) => {
  vip_level = level.toString();
};
