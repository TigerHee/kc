/**
 * Owner: melon@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default () => {
  const dispatch = useDispatch();
  // 获取福利中心-新用户配置 很多地方都需要用到这个配置信息 包括资产页引导入金文案/引导入金浮窗/资产中心
  // 用到的展示金额字段是 总奖励金额 和注册奖励金额
  useEffect(() => {
    dispatch({
      type: 'newhomepage/getKuRewardsNewcomerConfig',
    });
  }, [dispatch]);
};
