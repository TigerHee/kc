/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useSelector} from 'react-redux';

const useCoinMap = () => {
  const orderType = useSelector(state => state.convert.orderType);
  const matchCoinsMap = useSelector(state => state.convert.matchCoinsMap);

  return matchCoinsMap[orderType] ?? {};
};

export default useCoinMap;
