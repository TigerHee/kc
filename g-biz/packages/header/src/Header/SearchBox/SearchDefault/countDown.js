/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect, useMemo, useState } from 'react';
import { padStart } from 'lodash';
import { styled } from '@kux/mui';
import useInterval from '../../../hookTool/useInterval';
import { getTimeData } from '../config';

const CountDownWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 25px;
`;

const CountDownItem = styled.div`
  padding: 2px 4px;
  min-width: 26px;
  height: 25px;
  border-radius: 4px;
  background: #11c397;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.colors.textEmphasis};
`;

const CountDownDivider = styled.span`
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  color: ${(props) => props.theme.colors.primary};
`;

export default ({ initialSec = 0, finishFn = () => null }) => {
  const delay = 1000;
  const [times, setTimes] = useState(0);
  const clear = useInterval(() => {
    if (times > 0) {
      setTimes(times - 1);
    } else {
      finishFn();
      clear();
    }
  }, delay);

  const timeStrs = useMemo(() => {
    const temps = getTimeData(times);
    return temps.map((temp) => {
      return padStart(temp, 2, '0');
    });
  }, [times]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  useEffect(() => {
    let number = Number(initialSec) || 0;
    number = Math.ceil(number / 1000);
    setTimes(number && number > 0 ? number : 0);
  }, [initialSec]);
  return (
    <CountDownWrapper>
      <CountDownItem>{timeStrs[0]}</CountDownItem>
      <CountDownDivider>:</CountDownDivider>
      <CountDownItem>{timeStrs[1]}</CountDownItem>
      <CountDownDivider>:</CountDownDivider>
      <CountDownItem>{timeStrs[2]}</CountDownItem>
    </CountDownWrapper>
  );
};
