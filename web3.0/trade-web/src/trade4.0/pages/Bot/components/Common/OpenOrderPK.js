/**
 * Owner: mike@kupotech.com
 */
import styled from '@emotion/styled';
import React from 'react';
import { _t } from 'Bot/utils/lang';
import { Text } from '../Widgets';

const PK = styled.div`
  position: relative;
  height: 24px;
  line-height: 24px;
  border-radius: 4px;
  margin-bottom: 12px;
`;
const PKText = styled.div`
  position: relative;
  z-index: 1;
  font-size: 12px;
  font-weight: 500;
`;
const Progress = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  overflow: hidden;
  > span {
    border-radius: 4px;
    transition: width 0.3s linear;
  }
  .pk-green {
    float: left;
    box-sizing: border-box;
    height: 100%;
    background-color: ${(props) => props.theme.colors.primary12};
  }
  .pk-red {
    float: right;
    box-sizing: border-box;
    height: 100%;
    background-color: ${(props) => props.theme.colors.secondary12};
  }
`;
const Price = styled.span`
  z-index: 3;
`;
export default React.memo(({ buyNum, sellNum, currentPrice, className }) => {
  const buyRatio = ((buyNum / (buyNum + sellNum)) * 100).toFixed(0);
  const sellRatio = 100 - buyRatio;
  return (
    <PK className={className}>
      <PKText className="Flex vc sb pl-16 pr-16">
        <span className="color-primary">
          {_t('openorder4')}&nbsp;{buyNum}
        </span>
        {currentPrice && <Text color="text">{`${_t('robotparams12')} ${currentPrice}`}</Text>}
        <span className="color-secondary">
          {sellNum}&nbsp;{_t('openorder5')}
        </span>
      </PKText>
      <Progress>
        <span className="pk-green" style={{ width: `${buyRatio}%` }} />
        <span className="pk-red" style={{ width: `${sellRatio}%` }} />
      </Progress>
    </PK>
  );
});
