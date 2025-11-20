/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web
 */
import { pull } from 'tools/request';

/**
 * 新客任务-任务配置信息
 */
export const getNewcomerConfig = () => {
  return pull('/platform-reward/newcomer/config');
};

// 新客任务-获取用户任务状态
export const getNewcomerTaskStatus = () => {
  return pull('/platform-reward/newcomer/user/task/list');
};

export const getEarnInfo = (id) => {
  return pull(
    `/_pxapi/pool-staking/v3/products/${id}`,
    {},
    {
      baseURL: '',
      _useOwnUrl: true,
    },
  );
};
