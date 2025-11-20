/**
 * Owner: garuda@kupotech.com
 */
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';

const prefixTopic = '/contractAccount/wallet';
const prefixTrialTopic = '/trialContract/accountWallet';

export default function useWorkerWalletSubscribe() {
  // const dispatch = useDispatch();

  // 订阅socket
  useFuturesWorkerSubscribe(prefixTopic, true);
  useFuturesWorkerSubscribe(prefixTrialTopic, true);
}
