/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { styled } from '@kufox/mui/emotion';
import { useSelector } from 'dva';
import { useEventCallback } from '@kufox/mui/hooks';
import { map, size, filter, debounce } from 'lodash';
import { px2rem as _r } from '@kufox/mui/utils';
import Toast from 'components/Toast';
import Loading from 'components/Loading';
import { _t } from 'utils/lang';
import { NFT_QUIZ_STATUS } from 'config';

import primaryIcon from 'assets/NFTQuiz/next-normal.jpg';

import checkOkIcon from 'assets/NFTQuiz/check_ok.svg';
import checkErrIcon from 'assets/NFTQuiz/check_error.svg';
import checkTipIcon from 'assets/NFTQuiz/check_tip.svg';

import { useQuizContext } from '../context';
import styles from '../style.less';

import {
  Process,
  Title,
  BaseOption,
  Marker,
  HelpProgress,
} from './styled';

const IndexSymbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

const Wrapper = styled.section`
  margin-top: ${_r(20)};
`;

const DisabledOption = styled(BaseOption)`
  background: rgba(29, 33, 36, 0.4);
  border: ${_r(0.415551)} solid rgba(255,255,255, .3);
  color: rgba(255,255,255, .3);
  .txt {
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16);
  }
  .index {
  }
`;

const NextBtn = styled.p`
  margin-top: ${_r(32)};
  margin-bottom: ${_r(40)};
  text-align: center;
  > div {
    display: inline-block;
    border-radius: 50%;
    width: ${_r(50)};
    height: ${_r(50)};
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
`;

const getCorrectCount = (list) => {
  return size(filter(list, item => item._isAnswerRight));
};

const Question = ({
  disabled = true,
}) => {
  const {
    answerListProgress,
    todayAnswerInfo,
    answerList,
    dispatch,
    getCurrentConfig,
    activityConfig,
    isLogin,
  } = useQuizContext();
  const [applyLoading, pageLoading] = useSelector((state) => {
    const loading1 = state.loading.effects['nftQuiz/userCommitAnswer'];
    const loading2 = state.loading.effects['nftQuiz/postAnswer'];
    const questionLoading = state.loading.effects['nftQuiz/getAnswerList'];
    const infoLoading = state.loading.effects['nftQuiz/getTodayAnswerInfo'];
    const configLoading = state.loading.effects['nftQuiz/getQuizConfig'];
    return [
      loading1 || loading2,
      questionLoading || infoLoading || configLoading,
    ];
  });
  const {
    current = 0, // 当前答题进度，答题列表的index
  } = answerListProgress || {};
  const processTxt = `(Q${current + 1}/${answerList?.length || 0})`;

  const _todayCanAnswer = useMemo(() => {
    const { todayCanAnswer } = todayAnswerInfo || {};
    return todayCanAnswer;
  }, [todayAnswerInfo]);

  const isCurrent = activityConfig?.activityStatus === NFT_QUIZ_STATUS.CURRENT;

  const helpInfo = useMemo(() => {
    if (current === 0) return null;
    const correctCount = getCorrectCount(answerList);
    const langKey = '_CorrectedNumber_';
    const txt = _t('2n3e2rwpfTsK4hwefSuPGH', {
      CorrectedNumber: langKey
    });
    const startIndex = txt.indexOf(langKey);
    const numberContent = <span className='light'>{correctCount}</span>;
    const prefix = txt.substring(0, startIndex);
    const suffix = txt.substring(startIndex + langKey.length);
    return (
      <HelpProgress>
        &nbsp; {prefix}{numberContent}{suffix}
      </HelpProgress>
    );
  }, [answerList, current]);

  const item = answerList[current] || {};
  const { options, title } = item || {};

  // 是否显示下一题btn
  const isShowNextBtn = !disabled;
  const btnSrc = primaryIcon;
  const canGoNext = !!item.isCheck;

  const _checkAnswer = useEventCallback((answerIndex, isAnswerRight, sort) => {
    if (item.isCheck) return;
    const current = options[answerIndex];
    current.checkOk = isAnswerRight;
    current.checkIcon = isAnswerRight ? checkOkIcon : checkErrIcon;
    if (!isAnswerRight) {
      const okItem = options.find(i => i.rightAnswer);
      if (okItem) {
        okItem.tipOK = true;
        okItem.checkIcon = checkTipIcon;
      }
    }
    // 某题用户是否已经答过,以及对不对
    item.isCheck = true;
    item._isAnswerRight = isAnswerRight;
    item._result = sort;
    dispatch({
      type: 'nftQuiz/update',
      payload: {
        answerList: [
          ...answerList,
        ],
      },
    });
  });

  const toastMsg = useCallback(debounce(() => {
    const { answer } = activityConfig || {};
    const { tradeAmount } = answer || {};
    const msg = _t('xsrzBBLajywq4XLiBziwkQ', {
      Amount: tradeAmount
    });
    Toast({ type: 'info', msg });
  }, 500), [activityConfig]);


  const goNext = useEventCallback(() => {
    if (!canGoNext) return;
    if (current === size(answerList) - 1) {
      // 已到最后一题，且已经选择了答案，则进行提交答题
      // loading状态，不允许提交
      if (applyLoading) return;
      dispatch({
        type: 'nftQuiz/userCommitAnswer',
        payload: {
          config: getCurrentConfig(activityConfig),
          list: answerList,
        },
      });
      return
    }
    dispatch({
      type: 'nftQuiz/update',
      payload: {
        answerListProgress: {
          current: current + 1,
        }
      },
    });
  });

  return (
    <Wrapper>
      {(pageLoading || applyLoading) && (
        <Loading
          classNames={{
            container: styles.container,
            wrapper: styles.wrapper,
            item: styles.item,
          }}
        />
      )}
      <Process>
        {processTxt}
        {helpInfo}
      </Process>
      <Title>{title}</Title>
      {
        map(options, (option, index) => {
          const { desc, rightAnswer, sort } = option;
          const View = disabled ? DisabledOption : BaseOption;
          const activeClass = !disabled && !item.isCheck ? 'active' : '';
          const key = `${item?.id}_${sort}`;
          return (
            <View
              key={key}
              isLast={index === options.length - 1}
              className={`${activeClass}`}
              onClick={() => {
                // 不可答题状态
                if (disabled) {
                  // 登录状态，且在活动进行中，没有答题资格
                  // 若用户点击选项,增加一个toast提示,需要满足限额
                  if (!_todayCanAnswer && isLogin && isCurrent) {
                    toastMsg();
                  }
                  return;
                }
                _checkAnswer(index, rightAnswer, sort);
              }}
              checkOk={option.checkOk}
              tipOK={option.tipOK}
            >
              <span className='index'>
                {IndexSymbols[index]}
              </span>
              <span className='txt' key={key}>
                {desc}
              </span>
              {
                item.isCheck && (
                  <Marker
                    src={option.checkIcon}
                  />
                )
              }
            </View>
          )
        })
      }
      {
        isShowNextBtn && (
          <NextBtn>
            <div
              onClick={goNext}
              style={{
                backgroundImage: `url('${btnSrc}')`,
                opacity: canGoNext ? 1 : 0.4,
              }}
            />
          </NextBtn>
        )
      }
    </Wrapper>
  )
};

export default Question;