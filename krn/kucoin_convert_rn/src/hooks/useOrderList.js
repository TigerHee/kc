/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useSelector} from 'react-redux';

const useOrderList = (orderType = 'MARKET') => {
  const orderCoinList = useSelector(state => state.order.orderCoinList);
  const limitOrderCoinList = useSelector(
    state => state.order.limitOrderCoinList,
  );

  const orderHotsList = useSelector(state => state.order.orderHotsList);
  const limitOrderHotsList = useSelector(
    state => state.order.limitOrderHotsList,
  );

  const isMarket = orderType === 'MARKET';

  return {
    orderCoinList: isMarket ? orderCoinList : limitOrderCoinList,
    orderHotsList: isMarket ? orderHotsList : limitOrderHotsList,
  };
};

export default useOrderList;
