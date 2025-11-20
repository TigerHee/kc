/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';
import { useEventCallback } from '@kufox/mui/hooks';
import { NFT_QUIZ_TYPES } from 'config';
import { sensors } from 'utils/sensors';
import { _t } from 'utils/lang';
import icon from 'assets/NFTQuiz/learn_icon.png';
import Card from '../Card';
import {
  Row,
  Title,
  DESC,
  LOGO,
} from './styled';
import { useQuizContext } from '../context';

const Wrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${_r(16)} ${_r(28)} ${_r(16)} ${_r(16)};
  margin: ${_r(16)} 0;
  min-height: ${_r(100)};
  background: rgba(29, 33, 36, 0.4);
`;

const LearnNFT = () => {
  const {
    btnClickCheck, updateViewType,
    currentLang,
  } = useQuizContext();

  const clickLearn = useEventCallback(async () => {
    if (!(await btnClickCheck())) return;
    updateViewType(NFT_QUIZ_TYPES.LEARN);
    sensors.trackClick(['AwardLearning', '1'], {
      language: currentLang,
    });
  });
  return (
    <Wrapper onClick={clickLearn}>
      <Row>
        <div style={{ flex: 1 }}>
          <Title>{_t('piarZ8S8fRAHdZ9KMhEf16')}</Title>
          <DESC>{_t('jp4JWkf7ixBvh9q4hvYGUA')}</DESC>
        </div>
      </Row>
      <LOGO
        src={icon}
      />
    </Wrapper>
  );
};

export default LearnNFT;