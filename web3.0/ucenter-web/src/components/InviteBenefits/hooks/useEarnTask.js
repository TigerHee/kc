/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/hooks/biz/userNewCustomerTask/useEarnTask.js
 */
import { useCtx } from '../components/Context';
import { NEW_CUSTOMER_PRIZE_STATUS } from '../constants';
import useCountDown from '../hooks/useCountDown';

export default (typeKey) => {
  const { taskList } = useCtx();
  const { tempTask: limitTask } = taskList || {};
  const { isStart, isExpired } = useCountDown();
  const { [typeKey]: earnInfo = {} } = limitTask || {};
  const { currentBoughtAmount, prizeStatus } = earnInfo || {};
  // 审核中
  const isAuditing = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.RISK_AUDITING;
  // 是否已申购
  const isBuyed = (currentBoughtAmount || 0) > 0;
  // 是否已领取奖励
  const isCliamed = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.DRAWED;
  const isWaitCliam = isBuyed && prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.WAIT_DRAW;
  const isActivityStart = isStart;
  const isActivityEnd = isExpired;
  return {
    earnInfo: earnInfo || {},
    isBuyed,
    isCliamed,
    isWaitCliam,
    isActivityStart,
    isActivityEnd,
    isExpired,
    isAuditing,
  };
};
