/**
 * Owner: willen@kupotech.com
 */
import DateTimeFormat from 'components/common/DateTimeFormat';
import React from 'react';
import { _t } from 'tools/i18n';

const TimeAgoFormat = ({ timestamp }) => {
  const handleTimeFormat = (timestamp) => {
    let now = Date.now();
    let change = now - timestamp;
    let oneMinute = 1000 * 60;
    let sixtyMinutes = 1000 * 60 * 60;
    let twentyFourHours = sixtyMinutes * 24;
    let twoDays = twentyFourHours * 2;
    let sevenDays = twentyFourHours * 7;
    if (change < oneMinute) {
      return _t('coin.detail.time.ago.format.title.0');
    } else if (change < sixtyMinutes) {
      const time = Math.floor(change / 60000);
      return time > 1
        ? time + ' ' + _t('coin.detail.times.ago.format.title.1')
        : time + ' ' + _t('coin.detail.time.ago.format.title.1');
    } else if (change < twentyFourHours) {
      const time = Math.floor(change / sixtyMinutes);
      return time > 1
        ? time + ' ' + _t('coin.detail.times.ago.format.title.2')
        : time + ' ' + _t('coin.detail.time.ago.format.title.2');
    } else if (change <= twoDays) {
      return _t('coin.detail.times.ago.format.title.4');
    } else if (change < sevenDays) {
      const time = Math.floor(change / twentyFourHours);
      return time > 1
        ? time + ' ' + _t('coin.detail.times.ago.format.title.3')
        : time + ' ' + _t('coin.detail.time.ago.format.title.3');
    } else {
      return <DateTimeFormat>{timestamp}</DateTimeFormat>;
    }
  };
  return <React.Fragment>{timestamp ? handleTimeFormat(timestamp) : '--'}</React.Fragment>;
};

export default TimeAgoFormat;
