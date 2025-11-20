/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem as _r } from '@kufox/mui/utils';
import { useEventCallback } from '@kufox/mui/hooks';
import { size } from 'lodash';
import { NFT_QUIZ_TYPES } from 'config';
import { sensors } from 'utils/sensors';
import { _t } from 'utils/lang';
import historyIcon from 'assets/NFTQuiz/history.svg';
import Card from '../Card';
import { useQuizContext } from '../context';
import {
  TitlePanel,
  TitleOpt,
  TitleDesc,
} from './styled';

import InitOperation from './InitOperation';

const Wrapper = styled(Card)`
  margin-top: ${_r(40)};
  padding: ${_r(24)} ${_r(16)} ${_r(16)};
`;

const Question = ({
  children,
}) => {
  const { btnClickCheck, updateViewType, activityConfig, answerList } = useQuizContext();
  const { answer } = activityConfig || {};
  // 最低答对的数量
  const { minCorrectSize = '-' } = answer || {};
  const totalSize = size(answerList) || 20;
  const goHistory = useEventCallback(async () => {
    if (!(await btnClickCheck())) return;
    updateViewType(NFT_QUIZ_TYPES.HIS);
    sensors.trackClick(['Records', '1']);
  });
  
  return (
    <Wrapper>
      {/* 标题区域 */}
      <TitlePanel>
        <TitleOpt>
          <span className='title'>
            {_t('weu7odCQ1WVDu4pmmeEU4Y')}
          </span>
          <img
            alt='history-icon'
            src={historyIcon}
            onClick={goHistory}
          />
        </TitleOpt>
        <TitleDesc>
          {_t('kyLSNDF5Jebu8pJeoDnhng', {
            totalNumber: totalSize,
            CorrectNumber: minCorrectSize,
          })}
        </TitleDesc>
      </TitlePanel>
      {/* 答题主区域 */}
      {children}
      {/* 按钮主区域 */}
      <InitOperation/>
    </Wrapper>
  );
};

export default Question;