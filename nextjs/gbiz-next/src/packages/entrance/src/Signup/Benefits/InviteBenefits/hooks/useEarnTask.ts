/**
 * Owner: sean.shi@kupotech.com
 */
import { useInviteBenefits } from '../store';
import { NEW_CUSTOMER_PRIZE_STATUS } from '../constants';
import { useCountDown } from './useCountDown';
import { TaskList } from '../store';

export default (typeKey: 'financialVipTaskInfo' | 'financialNewcomerTaskInfo') => {
  const taskList = useInviteBenefits().taskList;
  const { tempTask: limitTask } = taskList || {};
  const { isStart, isExpired } = useCountDown();
  const earnInfo = limitTask?.[typeKey] || {} as TaskList['tempTask']['financialNewcomerTaskInfo'];
  const { currentBoughtAmount, prizeStatus } = earnInfo;
  const isAuditing = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.RISK_AUDITING;
  const isBuyed = (currentBoughtAmount || 0) > 0;
  const isCliamed = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.DRAWED;
  const isWaitCliam = isBuyed && prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.WAIT_DRAW;
  const isActivityStart = isStart;
  const isActivityEnd = isExpired;
  return {
    earnInfo,
    isBuyed,
    isCliamed,
    isWaitCliam,
    isActivityStart,
    isActivityEnd,
    isExpired,
    isAuditing,
  } as const;
};
