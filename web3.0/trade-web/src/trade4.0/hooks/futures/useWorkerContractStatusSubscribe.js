/**
 * Owner: garuda@kupotech.com
 */
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';

const prefixTopic = '/contract/normal';
const topicUpdate = '/contract/updated';
export default function useWorkerContractStatusSubscribe() {
  // 订阅socket
  useFuturesWorkerSubscribe(prefixTopic, false);
  useFuturesWorkerSubscribe(topicUpdate, false);
}
