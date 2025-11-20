/*
 * @owner: borden@kupotech.com
 */
import * as ws from '@kc/socket';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import { getTargetPriceSymbolsStr } from 'components/Isolated/utils';
import { topicName } from '@/pages/Assets/config';

// 余额推送
export const BalanceSocket = () => {
  useWorkerSubscribe(topicName, true);
  return null;
};
// 处理杠杆(全仓、逐仓都依赖)标记价格推送
export const MarkPriceSocket = () => {
  const currentSymbol = useGetCurrentSymbol();
  const pair = currentSymbol.split('-');
  const topic = getTopic(
    '/indicator/markPrice:{SYMBOL_LIST}',
    getTargetPriceSymbolsStr(pair),
  );
  useWorkerSubscribe(topic);
  return null;
};
// 全仓仓位数据订阅
export const CrossPositonSocket = () => {
  useWorkerSubscribe('/margin/position', true);
  useWorkerSubscribe('/margin/account', true);
  return null;
};
// 逐仓仓位数据订阅
export const IsolatedPositonSocket = () => {
  const currentSymbol = useGetCurrentSymbol();
  const isolatedPositionTopic = getTopic(
    '/margin/isolatedPosition:{SYMBOL_LIST}',
    currentSymbol,
  );
  useWorkerSubscribe(isolatedPositionTopic, true);
  return null;
};
