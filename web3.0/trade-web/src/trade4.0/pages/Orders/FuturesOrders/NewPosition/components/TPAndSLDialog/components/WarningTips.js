/**
 * Owner: clyne@kupotech.com
 */

import React, { memo, useEffect, useState } from 'react';
import { evtEmitter as eventEmmiter } from 'helper';
import { ICWarningOutlined } from '@kux/icons';
import useI18n from '@/hooks/futures/useI18n';
import { styled, fx } from '@/style/emotion';
import { PROFIT_TYPE } from '../constants';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${(props) => fx.color(props, 'complementary')}
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  .kux-icon-warning {
    font-size: 16px;
    display: block;
    ${(props) => fx.color(props, 'complementary')}
    margin-right: 4px;
  }
`;

const event = eventEmmiter.getEvt();

const getEventName = (type) => `SLP_TIPS_WARN_EVENT_${type}`;

const WarningTips = ({ type }) => {
  const [message, setMessage] = useState();
  const { _t } = useI18n();
  useEffect(() => {
    const eventName = getEventName(type);
    const handle = (v) => {
      if (v === 'reset') {
        setMessage('');
      } else {
        const msg =
          type === PROFIT_TYPE
            ? _t('kumex_coss_position_profit_price_less_liquidation_price')
            : _t('kumex_coss_position_stop_price_less_liquidation_price');
        setMessage(msg);
      }
    };
    event.on(eventName, handle);
    return () => event.off(eventName, handle);
  }, [_t, type]);

  if (!message) {
    return <></>;
  }
  return (
    <Wrapper>
      <ICWarningOutlined className="kux-icon-warning" />
      <div>{message}</div>
    </Wrapper>
  );
};

export const emitWarning = (type, data = '') => {
  const eventName = getEventName(type);
  event.emit(eventName, data);
};

export default memo(WarningTips);
