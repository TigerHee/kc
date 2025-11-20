/*
 * @Owner: jesse.shao@kupotech.com
 */
/* * Owner: tom@kupotech.com  * */
import React, { useMemo } from 'react';
import { isNumber } from 'lodash';
import { styled } from '@kufox/mui/emotion';

const Wrapper = styled.div`
  display: flex;
  height: ${props => props.height || '10px'};
  line-height: 10px;
  border-radius: 5px;
  overflow: hidden;
  font-weight: 700;
  font-size: 10px;
  color: #ffffff;
`;

const ProgressLeft = styled.div`
  width: ${props => props.width};
  background: linear-gradient(89.64deg, #1794f9 0.36%, #5dc2ff 91.68%);
  position: relative;
  padding-left: 8px;
`;

const DividerLine = styled.div`
  position: absolute;
  top: 0;
  right: -2px;
  width: 5px;
  height: 100%;
  ::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #f4fff2;
    transform: skew(-25deg);
  }
`;

const ProgressRight = styled.div`
  width: ${props => props.width};
  background: linear-gradient(270.53deg, #fcc957 -23.86%, #ffe792 103.59%);
  text-align: right;
  padding-right: 8px;
`;

/**
 * height: string  默认10px
 * mainProgress / subProgress: number
 **/
function Progress({ height, mainProgress, subProgress, showNum = true }) {
  const total = isNumber(mainProgress) && isNumber(subProgress) ? mainProgress + subProgress : null;

  const mainWidth = useMemo(
    () => {
      if (total) {
        return Math.floor((mainProgress / total) * 100);
      }
      return 50;
    },
    [mainProgress, total],
  );

  const subWidth = useMemo(
    () => {
      if (total) {
        return 100 - mainWidth;
      }
      return 50;
    },
    [mainWidth, total],
  );

  return (
    <Wrapper height={height}>
      <ProgressLeft width={`${mainWidth}%`}>
        <span>{showNum ? mainProgress : null}</span>
        <DividerLine />
      </ProgressLeft>
      <ProgressRight width={`${subWidth}%`}>{showNum ? subProgress : null}</ProgressRight>
    </Wrapper>
  );
}

export default Progress;
