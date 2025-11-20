/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { some, size } from 'lodash';
import { px2rem as _r } from '@kufox/mui/utils';
import { useEventCallback } from '@kufox/mui/hooks';
import { numberFixed } from 'helper';
import { _t } from 'utils/lang';
import { sensors } from 'utils/sensors';
import { kcsensorsManualExpose } from 'utils/ga';
import passIcon from 'assets/NFTQuiz/result_pass.svg';
import failureIcon from 'src/assets/NFTQuiz/result_failure.svg';
import { NFT_QUIZ_TYPES as TYPES } from 'config';
import { useQuizContext } from '../context';

const Wrapper = styled.section`
  margin-top: ${_r(68)};
  text-align: center;
`;

const Icon = styled.img`
  border: none;
  width: ${_r(64)};
  height: ${_r(77)};
  margin-bottom: ${_r(12)};
`;

const Desc = styled.p`
  margin-bottom: ${_r(8)};
  font-weight: 600;
  font-size: ${_r(16)};
  color: #fff;
  .amount {
    color: rgba(128, 220, 17, 1);
  }
`;

const Progress = styled.p`
  margin-bottom: ${_r(24)};
  font-weight: 400;
  font-size: ${_r(14)};
  color: #fff;
  opacity: 0.4;
`;

const Btn = styled.section`
  color: #000;
  width: 100%;
  padding: ${_r(12)} 0;
  background: #80DC11;
  border-radius: ${_r(24)};
  text-align: center;
  font-weight: 500;
  font-size: ${_r(16)};
`;

const RewardTip = styled.p`
  margin-top: ${_r(24)};
  text-align: center;
  font-weight: 400;
  font-size: ${_r(14)};
  color: #fff;
  opacity: 0.4;
`;

const QuestionResult = () => {
  const {
    todayAnswerInfo,
    activityConfig,
    dispatch,
    updateViewType,
    answerList,
    answerListProgress,
  } = useQuizContext();
  const {
    correctNum = 0,
    totalNum = 0,
    pass = false,
  } = todayAnswerInfo || {};
  const { currentPrize } = activityConfig || {};
  const { amount, prizeCode} = currentPrize || {};
  const isPass = pass;
  const icon = isPass ? passIcon : failureIcon;
  const resutText = useMemo(() => {
    if (!isPass) return _t('utCmN5MePEESeQbwDkysfD');
    return (
      <>
        {/* Congratulations, You have earned the right to divide the 
        <HelpProgress>
          <span className='light'>{separateNumber(amount)} {prizeCode}</span>
        </HelpProgress>
         reward */}
        {_t('o5PcWf8TtWNC5aekwoyHiL')}
      </>
    );
  }, [isPass]);
  const ratePrecent = numberFixed(((correctNum / (totalNum || 1)) * 100), 2);
  const rateTxt = _t('9Refbuo9G39uaPV8wEptaK', {
    CorrectedNumber: correctNum,
    totalNumber: totalNum,
    AccuracyRate: `${ratePrecent}%`,
  });
  const handleClick = useEventCallback(() => {
    if (isPass) {
      updateViewType(TYPES.HIS);
    } else {
      const isOld = size(answerList) < 1 || some(answerList, item => item.isCheck !== undefined);
      dispatch({
        type: 'nftQuiz/update',
        payload: {
          todayAnswerInfo: {
            ...(todayAnswerInfo || {}),
            correctNum: null,
            totalNum: null,
          },
          answerList: isOld ? [] : answerList,
          answerListProgress: isOld ? { current: 0 } : answerListProgress,
        },
      });
      isOld && dispatch({
        type: 'nftQuiz/getAnswerList',
      });
      sensors.trackClick(['OneMore', '1']);
    }
  });

  useEffect(() => {
    if (!isPass) return;
    kcsensorsManualExpose({ pass: isPass }, ['Pass', '1']);
  }, [isPass]);
  
  return (
    <Wrapper>
      <Icon src={icon} />
      <Desc>
        {resutText}
      </Desc>
      <Progress>
        {rateTxt}
      </Progress>
      <Btn onClick={handleClick}>
        {
          isPass ? _t('n7PVyvXMjJGLcRzM9gLGJJ') :
          _t('uCmbX8gCwYhFnqBJW2TVTV')
        }
      </Btn>
      {
        isPass && (
          <RewardTip>
            {_t('nHEhUeEJ8fMpernfMjXRHm')}
          </RewardTip>
        )
      }
    </Wrapper>
  );
};

export default QuestionResult;