/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import TooltipWrapper from '@/components/TooltipWrapper';
import AnimateWifi from './AnimateWifi';
import useOnlineStatus from '@/hooks/common/useOnlineStatus';

export const getNetWorkStatus = (delayHTTP) => {
  // 不可用
  if (delayHTTP < 0) {
    return 'unavailable';
  }
  // 正在连接网络 loading 效果
  if (delayHTTP === 0) {
    return 'loading';
  }
  // (1, 200] 满绿
  if (delayHTTP <= 200) {
    return 3;
  }
  // (200, 600] 2格绿
  if (delayHTTP <= 600) {
    return 2;
  }
  // (600, 1000] 1格绿
  if (delayHTTP <= 1000) {
    return 1;
  }
  // (1000, 2000] 黄色
  if (delayHTTP <= 2000) {
    return 'warning';
  }
  // >2000 红色
  if (delayHTTP > 2000) {
    return 'danger';
  }
};

/**
 * Wifi
 * wifi 模块
 * 1.连接网络时需要做 Wi-Fi 连接动效，所以手动 delayHTTP 为 0
 * 2. 有良好，一般，较差，无效 几种状态
 */
const Wifi = (props) => {
  const { ...restProps } = props;
  const delayHTTP = useSelector((state) => state.ping.delayHTTP);
  const [networkStatus, setNetworkStatus] = useState('unavailable');
  const dispatch = useDispatch();
  const onlineStatus = useOnlineStatus();

  useEffect(() => {
    if (onlineStatus) {
      // 每次连接网络时都重置为 0，做 Wi-Fi 连接动效
      dispatch({ type: 'ping/setDelayHTTP', payload: { delayHTTP: 0 } });
    }
    dispatch({ type: 'server_time/pullServerTime@polling:cancel' });
    dispatch({ type: 'server_time/pullServerTime@polling' });
  }, [onlineStatus]);

  useEffect(() => {
    setNetworkStatus(getNetWorkStatus(delayHTTP));
  }, [delayHTTP]);

  return (
    <TooltipWrapper
      title={`${delayHTTP < 0 ? 0 : delayHTTP} ms`}
      placement="bottom"
      {...restProps}
    >
      <AnimateWifi networkStatus={networkStatus} />
    </TooltipWrapper>
  );
};

export default memo(Wifi);
