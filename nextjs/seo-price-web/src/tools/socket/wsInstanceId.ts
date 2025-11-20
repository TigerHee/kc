/**
 * Owner: will.wang@kupotech.com
 * client模块
 */

let _MAX_INSTANCE_ID = 0;

export const generateUniqueWsInstanceId = () => {
  _MAX_INSTANCE_ID += 1;
  return _MAX_INSTANCE_ID;
}