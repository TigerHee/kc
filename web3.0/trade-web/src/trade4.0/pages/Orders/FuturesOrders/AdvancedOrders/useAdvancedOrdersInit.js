/**
 * Owner: charles.yang@kupotech.com
 */
import { useInitStopOrders } from '@/hooks/futures/useOrderStop';

const useAdvancedOrdersInit = (props) => {
  useInitStopOrders();
};

export default useAdvancedOrdersInit;
