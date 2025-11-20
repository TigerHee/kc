/**
 * Owner: garuda@kupotech.com
 */
import { useFuturesWorkerSubscribe } from '@/hooks/useWorkerSubscribe';

const prefixTopicLeverage = '/contract/crossLeverage';
const prefixTopicMarginMode = '/contract/marginMode';

export default function useWorkerCrossSubscribe() {
  useFuturesWorkerSubscribe(`${prefixTopicLeverage}`, true);
  useFuturesWorkerSubscribe(`${prefixTopicMarginMode}`, true);
}
