/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { styled } from '@/style/emotion';
import { eTheme } from '@/utils/theme';
import PhaseTime from './PhaseTime';
import PhaseInfoTitle from './PhaseInfoTitle';
import ProgressLine from './ProgressLine';
import FetureDes from './FetureDes';

const PhaseDiv = styled.div`
  background: ${eTheme('cover2')};
  border-radius: 12px;
`;

const PhaseInfoWrap = styled.div`
  display: flex;
`;

const PhaseInfoDiv = styled.div`
  text-align: center;
`;

const ProgressLineWrapper = styled.div`
  padding: 7px 12px;
  display: flex;
  height: 70px;
  margin-top: 1px;
`;

const FeaturesDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;


/**
 * 阶段信息
 * @param {{
 *  title: string,
 *  features: {label: string, disabled?: boolean}[],
 *  countDownInfo: Record<string, string>,
 * }} props
 */
const PhaseInfo = (props) => {
  const { title, features, countDownInfo } = props;
  return (
    <PhaseInfoDiv style={{ flexBasis: `${100 / features.length}%` }}>
      <PhaseInfoTitle title={title} isActive={countDownInfo.isActive || countDownInfo.isEnd} />
      <FeaturesDiv>
        {features.map((item, index) => (
          <FetureDes {...item} key={String(index)} isActive={countDownInfo.isActive || countDownInfo.isEnd} />
        ))}
      </FeaturesDiv>
      <PhaseTime countDownInfo={countDownInfo} />
    </PhaseInfoDiv>
  );
};

/**
 * 集合竞价介绍
 * @param {{
 * list: any[]
 * }} props
 */
const Step = (props) => {
  const { list } = props;
  return (
    <PhaseDiv>
      <PhaseInfoWrap>
        {list.map((item, index) => <PhaseInfo {...item} key={String(index)} />)}
      </PhaseInfoWrap>
      <ProgressLineWrapper>
        {
          list.map(({ countDownInfo, ...others }, index) => (
            <ProgressLine {...others} {...countDownInfo} key={String(index)} offset={index > 0} />
          ))
        }
      </ProgressLineWrapper>
    </PhaseDiv>
  );
};

export default memo(Step);
