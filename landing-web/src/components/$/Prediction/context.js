/**
 * Owner: jesse.shao@kupotech.com
 */
import { createContext, useContext } from 'react';

// 卡片 context
export const ScheduleContext = createContext({
  isEnd: false,
  notStart: false,
  inProcessing: false,
});
export const useScheduleContext = () => {
  const itemInfo = useContext(ScheduleContext);
  return itemInfo;
};
