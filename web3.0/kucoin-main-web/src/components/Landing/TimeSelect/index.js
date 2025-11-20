/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import { useResponsive } from '@kux/mui/hooks';
import { _t } from 'src/tools/i18n';
import { SelectWrapper, SelectItem } from './index.style';

const timeConfig = {
  changeRate1h: {
    title: _t('coin.detail.line.type.1H'),
    value: 'changeRate1h',
  },
  changeRate4h: {
    title: _t('dqrQjbf4rqBNeY6gubV8VA'),
    value: 'changeRate4h',
  },
  changeRate24h: {
    title: _t('coin.detail.line.type.24H'),
    value: 'changeRate24h',
  },
};

const defaultRate = 'changeRate24h';

const TimeSelect = ({ changeType }) => {
  const [active, setActive] = useState(defaultRate);
  const responsive = useResponsive();

  const handleSelect = useCallback(
    (item) => {
      setActive(item);
      changeType(item);
    },
    [changeType],
  );

  return (
    <SelectWrapper>
      {Object.entries(timeConfig).map(([key, val]) => {
        return (
          <SelectItem
            key={val.value}
            selected={active === val.value}
            lg={responsive.lg}
            onClick={() => handleSelect(val.value)}
            role="button"
            tabIndex={val.value}
          >
            {val.title}
          </SelectItem>
        );
      })}
    </SelectWrapper>
  );
};

export default TimeSelect;
