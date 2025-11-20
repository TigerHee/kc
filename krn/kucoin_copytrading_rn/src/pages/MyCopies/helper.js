import moment from 'moment';

import {getStartTimeByDatePickValue} from 'constants/date';

export const convertMyCopiesFilterValue2Payload = (filterValues = {}) => {
  const {startDate, traderLeadConfigId} = filterValues;

  return {
    startTime:
      startDate && moment(getStartTimeByDatePickValue(startDate)).valueOf(),
    leadConfigIds: Array.isArray(traderLeadConfigId)
      ? traderLeadConfigId.join(',')
      : traderLeadConfigId,
  };
};
