/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { times100 } from 'Bot/helper';
import useTicker from 'Bot/hooks/useTicker';
import { getLongShortRatio } from 'Bot/Strategies/FutureGrid/services';
import { UnicodeRTL } from 'Bot/components/ColorText';
import { Text, Flex } from 'Bot/components/Widgets';
import { _t } from 'Bot/utils/lang';

const PKBox = styled.div`
  min-width: 110px;
  width: 50%;
  font-size: 12px;
  .pk-ratio {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 2px 0;
    overflow: hidden;
    span {
      position: relative;
      height: 2px;
      transition: all 0.3s linear;
      border-radius: 80px;
    }
  }
  .bar-primary {
    background-color: ${(props) => props.theme.colors.primary};
  }
  .bar-secondary {
    background-color: ${(props) => props.theme.colors.secondary};
    margin-left: 2px;
  }
`;

export default React.memo(({ symbolCode }) => {
  const [ratio, setLongShort] = useState({
    longUser: 0,
    shortUser: 0,
  });
  const fetchLongShortRatio = useCallback(
    (_) => {
      symbolCode &&
        getLongShortRatio(symbolCode).then(({ data }) => {
          if (data) {
            setLongShort(data);
          }
        });
    },
    [symbolCode],
  );

  useTicker(fetchLongShortRatio);
  let { longUser, shortUser } = ratio;
  if (longUser === 0 && shortUser === 0) {
    longUser = shortUser = 1;
  }
  let longRatio = Number((longUser / (shortUser + longUser)).toFixed(4));
  let shortRatio = Number((1 - longRatio).toFixed(4));
  longRatio = `${times100(longRatio, 0)}%`;
  shortRatio = `${times100(shortRatio, 0)}%`;

  return (
    <PKBox>
      <Flex sb>
        <Text color="primary">
          <UnicodeRTL>{longRatio}</UnicodeRTL>
          {` ${_t('futrgrid.zuoduo2')}`}
        </Text>
        <Text color="secondary" className="right">
          {`${_t('futrgrid.zuokong2')} `}
          <UnicodeRTL>{shortRatio}</UnicodeRTL>
        </Text>
      </Flex>
      <div className="pk-ratio">
        <span className="bar-primary" style={{ width: longRatio }} />
        <span className="bar-secondary" style={{ width: shortRatio }} />
      </div>
    </PKBox>
  );
});
