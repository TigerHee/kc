/**
 * Owner: John.Qi@kupotech.com
 */
import styled from '@emotion/styled';
import { useResizeObserverBody } from 'hooks';
import { useCallback, useEffect, useState } from 'react';
import useInterval from 'src/hooks/useInterval';
import { eScreenStyle, eTheme, eTrueStyle, _t } from '../utils';

const GetEmailCode = styled.span`
  &:hover {
    color: ${eTheme('textPrimary')};
  }
`;

const EmailCodeVerifyWrap = styled.span`
  color: ${eTheme('text30')};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 0.5px;
  ${eTrueStyle('littleScreen')`
    color: ${eTheme('textPrimary')};
  `}
  ${eScreenStyle('Max768')`
    font-size: 14px;
    line-height: 1.7;
  `}
`;

const CountdownNumber = styled(GetEmailCode)`
  cursor: disabled;
`;

const EmailCode = (props) => {
  const { onOk } = props;
  const onClick = useCallback(() => {
    onOk();
  }, [onOk]);
  return (
    <GetEmailCode className="pointer" onClick={onClick}>
      {_t('cEFtJ9pkXfPB7CrdnnBR4c', '获取验证码')}
    </GetEmailCode>
  );
};

const CountDown = (props) => {
  const { seconds = 60, onEnd } = props;
  const [time, setTime] = useState(seconds);

  useInterval(() => {
    setTime((time) => {
      return time > 0 ? time - 1 : 0;
    });
  }, 1000);

  const isEnd = time === 0;
  useEffect(() => {
    if (isEnd) {
      onEnd();
    }
  }, [isEnd, onEnd]);

  const times = String(time).padStart(2, '0');
  return <CountdownNumber>{times}S</CountdownNumber>;
};

/**
 * 邮箱验证
 * @param {{
 *  onClick: Function,
 *  seconds?: number,
 *  ready?: boolean,
 * }} props
 * @returns
 */
const EmailCodeVerify = (props) => {
  const { seconds, onClick, ready } = props;

  const [showOper, setShowOper] = useState(true);
  const onOk = useCallback(() => {
    if (!ready) return;
    onClick?.()
      ?.then((res) => {
        setShowOper(false);
        return res;
      })
      .catch((res) => {
        return res;
      });
  }, [onClick, ready]);

  const onEnd = useCallback(() => {
    setShowOper(true);
  }, []);
  const { breakpointsDown, screen } = useResizeObserverBody();
  const littleScreen = breakpointsDown('Max1200');

  return (
    <EmailCodeVerifyWrap littleScreen={littleScreen} screen={screen}>
      {showOper ? <EmailCode onOk={onOk} /> : <CountDown onEnd={onEnd} seconds={seconds} />}
    </EmailCodeVerifyWrap>
  );
};

export default EmailCodeVerify;
