/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { styled } from '@kufox/mui/emotion';
import {
  map,
  size,
} from 'lodash';
import { px2rem as _r } from '@kufox/mui/utils';
import { NFT_QUIZ_STATUS } from 'config';
import { _t } from 'utils/lang';
import { sensors } from 'utils/sensors';
import tipIcon from 'assets/NFTQuiz/tip_icon.svg';
import { useQuizContext } from '../context';

const Wrapper = styled.section`
  margin-top: ${_r(20)};
`;

const Icon = styled.img`
  position: relative;
  top: 0;
  width: ${_r(12)};
  height: ${_r(12)};
  border: none;
  margin-left: ${_r(4)};
`;
const Btn = styled.p`
  margin-top: ${_r(20)};
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
`;

const BtnItem = styled.span`
  color: #000;
  display: inline-flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: ${_r(45)};
  background: ${({ cate }) => cate === 'normal' ? '#80DC11' : '#8AEAC2'};
  border-radius: ${_r(24)};
  margin-right: ${({ hasPadding }) => hasPadding ? _r(12): 0};
  font-weight: 500;
  font-size: ${_r(16)};
`;

const Desc = styled.p`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: ${_r(14)};
  line-height: ${_r(22)};
`;

const Expand = styled.div`
  position: absolute;
  width: ${_r(36)};
  height: ${_r(36)};
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

/**
 * 活动未开始，或未登录、或已结束下，相关按钮面板（去登录、去交易等）
 * @param {*} props 
 * tradeBtns = [{
 *  cate: 'normal', // 'secondary',
 *   txt: '',
 *   onClick: () => {},
 *   classes: '',
 * }]
 */

const InitOperation = (props) => {
  
  const {
    activityConfig,
    isLogin,
    handleLogin,
    openShare,
    todayAnswerInfo,
    goToTrade,
    toggleTradeTip,
    isAnswered,
    currentLang,
  } = useQuizContext();

  const { desc, tradeBtns } = useMemo(() => {
    // 未登录
    if (!isLogin) {
      return {
        tradeBtns: [{
          cate: 'normal',
          txt: _t('oSBn9TdY1urgZ7KNoPxPsx'),
          onClick: handleLogin,
        }],
        desc: _t('8FzEuQ6aYLpEhQqawVtQJV')
      }
    }
    // 未开始
    if (activityConfig?.activityStatus === NFT_QUIZ_STATUS.NOT_BEGIN) {
      // const { start = 0 } = activityConfig || {};
      return {
        tradeBtns: [{
          cate: 'normal',
          txt: _t('9iwe2wWe545vdtHLE7yr2a'),
          onClick: openShare,
        }],
        // desc: `The event will begin on ${getUtcZeroTime(start)} (UTC)`
        desc: _t('cjWvwMd5HqvHx67LgW2gfh'),
      };
    }
    // 已开始
    if (activityConfig?.activityStatus === NFT_QUIZ_STATUS.CURRENT) {
      // todayCanAnswer： 用户当日是否满足最低活动的交易限额要求
      const { todayCanAnswer = false } = todayAnswerInfo || {};
      const { answer } = activityConfig || {};
      const { tradeAmount } = answer || {};
      const desc = (
        <>
          {_t('xsrzBBLajywq4XLiBziwkQ', {
            Amount: tradeAmount
          })}
          <div style={{ position: 'relative', display: 'flex', top: 1 }}>
            <Icon
              alt="tip_icon"
              src={tipIcon}
            />
            <Expand onClick={toggleTradeTip} />
          </div>
        </>
      )
      const hasPlan = size(activityConfig?.config) > 0;
      if (todayCanAnswer || isAnswered || !hasPlan) return {};
      return {
        tradeBtns: [{
          cate: 'normal',
          txt: _t('jPA5rkKWijdeQhebvVAsWB'),
          onClick() {
            goToTrade('SPOT');
            sensors.trackClick(['Spot', '1'], {
              language: currentLang,
            });
          },
        },
        {
          cate: 'secondary',
          txt: _t('uuFbJYMGYp2n8WP72qma5t'),
          onClick() {
            goToTrade('FUTURE');
            sensors.trackClick(['Futures', '1'], {
              language: currentLang,
            });
          },
        }],
        desc,
      }
    }
    // 已结束
    if (activityConfig?.activityStatus === NFT_QUIZ_STATUS.EXPIRED) {
      return {
        tradeBtns: [],
        desc: _t('2utDGQgL55hkHrZ8PMjc35'),
      }
    }
    return {};
  }, [
    activityConfig,
    isLogin,
    handleLogin,
    openShare,
    todayAnswerInfo,
    goToTrade,
    toggleTradeTip,
    isAnswered,
    currentLang,
  ]);

  return (
    <Wrapper>
      { desc ? <Desc>{desc}</Desc> : null}
      <Btn>
        {
          map(tradeBtns, ({ txt, classes = '', ...rest }, index) => {
            const hasPadding = tradeBtns.length > 1 && (index + 1) !== tradeBtns.length;
            return (
              <BtnItem
                key={index}
                {...rest}
                className={classes}
                hasPadding={hasPadding}
              >
                {txt}
              </BtnItem>
            )
          })
        }
      </Btn>
    </Wrapper>
  );
};

export default InitOperation;