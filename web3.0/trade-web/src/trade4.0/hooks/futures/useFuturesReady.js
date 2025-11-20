/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回合约是否初始化完成
 */

import { useSelector } from 'react-redux';

const useFuturesReady = () => {
  const futuresReady = useSelector((state) => state.futuresCommon.futuresReady);
  return futuresReady;
};

export default useFuturesReady;
