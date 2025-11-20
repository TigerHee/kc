/* eslint-disable max-len */
/**
 * Owner: Ray.Lee@kupotech.com
 */

import React, { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useIsRTL } from '@/hooks/common/useLang';

const RED = '#F65454';
const BLUE = '#01BC8D';

const SvgWrapper = styled.div`
  width: 18px;
  height: 16px;
  position: relative;
  display: flex;
  align-items: center;
`;

const SvgInner = styled.div`
  width: 4px;
  height: 4px;
  position: absolute;
  border: 1px solid #737e8d;
  border-radius: 50%;
  position: absolute;
  top: 7px;
  left: 7px;

  transform: rotate(0deg);

  &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 1px;
    background-color: #737e8d;
    right: 3px;
    top: 50%;
    transform: translate(0, -50%);
    border-radius: 50%;
  }
  transition: .3s all ease;
`;

const GaugeSvg = styled.svg`
  position: relative;
`;

/**
 * 风险仪表图
 * deg = percent * 1.8
 */
const Dashboard = (props) => {
  const { value = 0, ...otherProps } = props;
  const rotateRef = useRef();
  const isRTL = useIsRTL();

  useEffect(() => {
    const deg = Math.min(Math.max(0, value), 1) * 100 * 1.8;
    rotateRef.current.style.transform = `rotate(${deg}deg)`;
  }, [value]);

  return (
    <SvgWrapper {...otherProps}>
      <GaugeSvg
        width="18"
        height="16"
        viewBox="0 0 18 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.25469 13C2.46381 11.8662 2 10.4872 2 9C2 7.51275 2.46381 6.13383 3.25469 5C4.51964 3.18652 6.62125 2 9 2C12.866 2 16 5.13401 16 9C16 10.4872 15.5362 11.8662 14.7453 13"
          stroke={isRTL ? RED : BLUE}
          strokeWidth="2"
        />
        <path
          d="M14.7455 13C15.5364 11.8662 16.0002 10.4872 16.0002 9C16.0002 5.13401 12.8662 2 9.00019 2C6.62145 2 4.51983 3.18652 3.25488 5"
          stroke="#F8B200"
          strokeWidth="2"
        />
        <path
          d="M14.7456 13C15.5365 11.8662 16.0003 10.4872 16.0003 9C16.0003 7.51275 15.5365 6.13383 14.7456 5"
          stroke={isRTL ? BLUE : RED}
          strokeWidth="2"
        />
      </GaugeSvg>
      <SvgInner ref={rotateRef} className="rotate" />
    </SvgWrapper>
  );
};

export default React.memo(Dashboard);
