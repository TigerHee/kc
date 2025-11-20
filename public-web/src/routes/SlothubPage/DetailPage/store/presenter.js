/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-19 14:39:20
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-21 14:54:47
 */
import { BACKEND_PROJECT_STATUS_TYPE, PROJECT_ACTIVITY_STATUS } from '../../constant';

export const getActivityStatus = ({ status, endTime, startTime }) => {
  const isActivityRunning = status === BACKEND_PROJECT_STATUS_TYPE.RUNNING;
  if (!isActivityRunning || endTime < Date.now()) {
    return PROJECT_ACTIVITY_STATUS.activityEnded;
  }
  if (isActivityRunning) {
    if (startTime > Date.now()) {
      return PROJECT_ACTIVITY_STATUS.activityNotStarted;
    }
    return PROJECT_ACTIVITY_STATUS.activityOngoing;
  }
};
