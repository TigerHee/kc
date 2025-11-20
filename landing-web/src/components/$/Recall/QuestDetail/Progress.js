/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { _t, _tHTML } from 'utils/lang';
import { px2rem } from '@kufox/mui/utils';
import { sub } from 'helper';
import { toNumber, isNil } from 'lodash';

import { formatNumber } from 'components/$/Recall/config';

import { useSelector } from 'dva';
import { saTrackForBiz } from 'utils/ga';

const Wrapper = styled.div`
  margin-top: ${px2rem(20)};
`;
const Title = styled.div`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: ${px2rem(16)};
  color: ${({ theme }) => theme.colors.text24};
  margin-bottom: ${px2rem(7)};
`;
const ProgressBar = styled.div`
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: ${px2rem(4)};
  height: ${px2rem(9)};
  position: relative;
  overflow: hidden;
  display: flex;
  margin-bottom: ${px2rem(6)};
  justify-content: space-evenly;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ width }) => width};
    height: 100%;
    background-color: ${({ theme, expire }) =>
      expire ? theme.colors.cover12 : theme.colors.primary};
    content: '';
  }
`;
const Border = styled.span`
  position: relative;
  z-index: 2;
  width: ${px2rem(2)};
  height: 100%;
  background: ${({ theme }) => theme.colors.textEmphasis};
  justify-content: space-evenly;
`;

const CompleteRatio = styled.div`
  display: flex;
  align-items: center;
`;
const Left = styled.div`
  flex: 1;
  i {
    color: ${({ theme }) => theme.colors.text24};
    font-weight: 400;
    font-style: normal;
  }
  i:nth-of-type(1) {
    margin-right: ${px2rem(4)};
    font-size: ${px2rem(12)};
    line-height: ${px2rem(16)};
  }
  i:nth-of-type(2) {
    color: ${({ theme, expire }) => (expire ? theme.colors.text24 : theme.colors.primary)};
    font-size: ${px2rem(16)};
    line-height: ${px2rem(20)};
  }
  i:nth-of-type(3) {
    font-size: ${px2rem(16)};
    line-height: ${px2rem(20)};
  }
`;
const Right = styled.div`
  i {
    color: ${({ theme }) => theme.colors.text24};
    font-weight: 400;
    font-style: normal;
  }
  i:nth-of-type(1) {
    margin-right: ${px2rem(4)};
    font-size: ${px2rem(12)};
    line-height: ${px2rem(16)};
  }
  i:nth-of-type(2) {
    font-size: ${px2rem(16)};
    line-height: ${px2rem(20)};
  }
`;
const Progress = ({ current, target, expire, loadingTime, optionKey }) => {
  const { generalInfo } = useSelector((state) => state.userRecall);
  const currentNum = isNil(current) ? 0 : toNumber(current);
  const targetNum = isNil(target) ? 0 : toNumber(target);

  useEffect(() => {
    if (loadingTime && !expire) {
      if (currentNum < targetNum) {
        try {
          saTrackForBiz({}, ['ongoingTask', '1'], {
            optionKey,
            allItemAmount: generalInfo?.curStageOrder, //所属阶段
            loadingTime,
            intervals: Math.min(currentNum, targetNum),
          });
        } catch (e) {
          console.log('e', e);
        }
      }
    }
  }, [loadingTime, currentNum, targetNum, expire]);
  return (
    <Wrapper>
      <Title>{_t('k4Y1xjGBigc1T3Cj31AFFu')}</Title>
      <ProgressBar width={`${Math.min((currentNum * 100) / targetNum, 100)}%`} expire={expire}>
        <Border />
        <Border />
        <Border />
      </ProgressBar>
      <CompleteRatio>
        <Left expire={expire}>
          {_tHTML('dXA2DqtWqmh1VUjhiLjPrq', {
            current: formatNumber(Math.min(currentNum, targetNum)),
            total: formatNumber(targetNum),
            currency: '',
          })}
        </Left>
        <Right>
          {_tHTML('hFvbvFEsX1UjP9meW9dTuG', {
            number: formatNumber(Math.max(sub(targetNum, currentNum), 0)),
            currency: '',
          })}
        </Right>
      </CompleteRatio>
    </Wrapper>
  );
};

export default Progress;
