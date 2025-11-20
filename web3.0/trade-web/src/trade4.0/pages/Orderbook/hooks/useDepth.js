/*
 * owner: Clyne@kupotech.com
 */
import { useDispatch } from 'dva';
import { namespace } from '@/pages/Orderbook/config';

// 设置depth相关的api
export const useDepthUpdate = () => {
  const dispatch = useDispatch();
  const setDepth = (value) => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        currentDepth: value,
      },
    });
  };

  const setDepthConfig = (configs = []) => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        depthConfig: configs,
      },
    });
  };

  return { setDepth, setDepthConfig, dispatch };
};
