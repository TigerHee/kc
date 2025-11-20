/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useRef } from 'react';
import { styled } from '@/style/emotion';
import useDomBox from '@/hooks/useDomBox';
import ProgressLine from './ProgressLine';

const PhaseDiv = styled.div`
  text-align: left;
  position: relative;
  border-radius: 12px;
`;

/**
 * 集合竞价介绍
 * @param {{
 *  vertical: boolean,
 *  list: any[],
 * }} props
 */
const StepVertical = (props) => {
  const { vertical, list } = props;
  const height = 318;
  const lineHeight = (height - 24) / 3;
  const wrapperRef = useRef();
  const { width } = useDomBox(wrapperRef);
  return (
    <PhaseDiv style={{ height, paddingBottom: 12 }} ref={wrapperRef}>
      {list.map(({ countDownInfo, ...others }, index) => (
        <div style={{ height: lineHeight }} key={String(index)}>
          <ProgressLine
            {...countDownInfo} {...others}
            vertical={vertical}
            verticalHeight={lineHeight}
            verticalWidth={width}
          />
        </div>
      ))}
    </PhaseDiv>
  );
};

export default memo(StepVertical);
