/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/NewCustomerTask/Task/LimitTaskArea/components/FuturesTrailFundTask/Level.js
 */
import { styled } from '@kux/mui';
import { find, sortBy } from 'lodash';
import { memo, useMemo } from 'react';
import useHtmlToReact from 'src/hooks/useHtmlToReact';
import { _t, _tHTML } from 'src/tools/i18n';
import currentFilledSrc from 'static/ucenter/signUp/current-filled-img.svg';
import logoSrc from 'static/ucenter/signUp/task-tag-logo.svg';
import { NEW_CUSTOMER_PRIZE_STATUS, NEW_CUSTOMER_TASK_STATUS } from '../../constants';
import { useFormat } from '../../hooks/useFormat';
import { useCtx } from '../Context';

const Container = styled.div`
  margin-top: 40px;
  padding-bottom: 40px;
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.cover12};
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 130%;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 15px;
  font-weight: 400;
  line-height: 150%;
  margin-top: 6px;
  span span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

/**
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/hooks/biz/userNewCustomerTask/useLimitTask.js
 */
const useLimitLevel = (limitTask) => {
  const { limitTaskInfo } = limitTask || {};
  const { limitTaskLevel, userLevel, taskStatus, prizeStatus } = limitTaskInfo || {};

  const { _limitTaskLevel, currentLevelInfo } = useMemo(() => {
    const levels = sortBy(limitTaskLevel || [], (i) => i.level);
    const currentLevelInfo = find(levels, (i) => i.level == userLevel);
    return {
      _limitTaskLevel: levels,
      currentLevelInfo,
    };
  }, [limitTaskLevel, userLevel]);

  const { maxPrizeAmount, maxLevel } = useMemo(() => {
    const maxItem = _limitTaskLevel[_limitTaskLevel.length - 1] || {};
    const { prizeAmount = 0, level } = maxItem;
    return {
      maxPrizeAmount: prizeAmount,
      maxLevel: level,
    };
  }, [_limitTaskLevel]);

  const isComplete = taskStatus === NEW_CUSTOMER_TASK_STATUS.COMPLETE;
  const isProcessing = taskStatus === NEW_CUSTOMER_TASK_STATUS.PROCESSING;
  const canCliamPrize = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.WAIT_DRAW;
  const prizeDrawed = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.DRAWED;

  const data = useMemo(() => {
    return {
      ...(limitTaskInfo || {}),
      limitTaskLevel: _limitTaskLevel,
      currentLevelInfo,
      currentLevel: currentLevelInfo?.level || 0,
      isComplete,
      isProcessing,
      canCliamPrize,
      prizeDrawed,
      maxPrizeAmount,
      maxLevel,
    };
  }, [limitTaskInfo, _limitTaskLevel, currentLevelInfo, taskStatus, maxPrizeAmount, maxLevel]);

  return data;
};

const LevelBox = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

const LevelItem = styled.div`
  position: relative;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  display: flex;
  flex-direction: column;
  flex: 1;
  &:not(:last-of-type) {
    margin-bottom: 0;
  }
`;

const LevelLine = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  flex-direction: column-reverse;
  flex-grow: 0;
`;

const getWebProgressBg = (props) => {
  return props.theme.currentTheme === 'dark'
    ? props.filled
      ? 'linear-gradient(to bottom, #01BC8D 2.08%, rgba(1, 188, 141, 0.00) 100%)'
      : 'linear-gradient(to bottom, rgba(227, 227, 227, 0.08) 0%, rgba(227, 227, 227, 0.00) 100%)'
    : props.filled
    ? 'linear-gradient(to bottom, #01BC8D 2.08%, rgba(1, 188, 141, 0.00) 100%)'
    : 'linear-gradient(to bottom, rgba(29, 29, 29, 0.08) 0%, rgba(29, 29, 29, 0.00) 100%)';
};

const getWebRtlProgressBg = (props) => {
  return props.theme.currentTheme === 'dark'
    ? props.filled
      ? 'linear-gradient(180deg, rgba(1, 188, 141, 1) 0%, rgba(1, 188, 141, 0.00) 100%)'
      : 'linear-gradient(to bottom, rgba(227, 227, 227, 0.08) 0%, rgba(227, 227, 227, 0.00) 100%)'
    : props.filled
    ? 'linear-gradient(180deg, rgba(1, 188, 141, 1) 0%, rgba(1, 188, 141, 0.00) 100%)'
    : 'linear-gradient(to bottom, rgba(29, 29, 29, 0.08) 0%, rgba(29, 29, 29, 0.00) 100%)';
};

const LevelProgress = styled.div`
  border-radius: 5px;
  position: relative;
  width: 36px;
  max-width: initial;
  height: ${(props) => props.length}px;
  background: ${(props) => getWebProgressBg(props)};
  [dir='rtl'] & {
    background: ${(props) => getWebRtlProgressBg(props)};
  }
`;

const LevelTag = styled.img`
  transform: rotate(0.622deg) translateY(1px);
  position: relative;
  top: initial;
  right: initial;
  width: 20px;
  height: 15px;
`;

const RenderFlag = memo(({ isFinalLevel } = {}) => {
  /* 最后一级-皇冠 */
  return isFinalLevel ? <LevelTag src={logoSrc} alt="current-level-tag" /> : null;
});

const LevelAmount = styled.span`
  color: ${(props) => (props.filled ? props.theme.colors.primary : props.theme.colors.text)};
  font-weight: 700;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin-bottom: 4px;
  margin-left: 0;
  font-size: 14px;
`;

const LevelDesc = styled.div`
  font-size: 10px;
  font-weight: 400;
  margin-top: 4px;
  margin-left: 0;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  max-width: 100px;
  word-break: break-all;
  display: flex;
  align-items: center;
  line-height: 150%;
`;

const CurrentFillImg = styled.img`
  width: 11.6px;
  height: 20px;
  margin-left: 4px;
`;

const DescText = memo(({ nFormatterK, startTradeAmount, startDepositAmount } = {}) => {
  return startTradeAmount <= 0
    ? _tHTML('8EsvHRGtdy7EAcY1akhbWr', {
        amount: nFormatterK(startDepositAmount),
        currency: window._BASE_CURRENCY_,
      })
    : _tHTML('sN6Xt4oy7jzsVggBmncbHx', {
        amount: nFormatterK(startDepositAmount),
        currency: window._BASE_CURRENCY_,
        amount2: nFormatterK(startTradeAmount),
        currency2: window._BASE_CURRENCY_,
      });
});

export function Level() {
  const { taskList } = useCtx();
  const { formatNum, nFormatterK } = useFormat();

  const { subtitle } = taskList?.tempTask?.limitTaskInfo || {};
  const { eles: subtitleReact } = useHtmlToReact({ html: subtitle || '' });
  const subtitleContent = subtitle ? (
    <span>{subtitleReact}</span>
  ) : (
    _tHTML('vDzdN3fTACepGcVvjVBXYv', {
      amount: formatNum(7500),
      currency: window._BASE_CURRENCY_,
    })
  );

  const levelInfo = useLimitLevel(taskList?.tempTask);
  const { maxLevel, currentLevel, limitTaskLevel = [] } = levelInfo ?? {};
  const _isCompleteTask = currentLevel && currentLevel >= 1;
  const _isCompleteFinalTask = _isCompleteTask && maxLevel === currentLevel;

  if (!taskList) {
    return null;
  }

  return (
    <Container>
      <Title>{_t('eUV1Qn4Zn88M6AQpFPEzAs')}</Title>
      <Description>{subtitleContent}</Description>
      <LevelBox>
        {limitTaskLevel?.map(
          ({ level, startDepositAmount, startTradeAmount, prizeAmount }, index) => {
            //拷贝自 platform-operation-web: src/components/$/KuRewards/NewCustomerTask/Task/LimitTaskArea/components/FuturesTrailFundTask/Level.js
            const isFinalLevel = maxLevel && maxLevel == level;
            const isFinalFilledLevel = _isCompleteFinalTask && currentLevel == level;
            const length = 50 + index * 20;

            const isNotStart = (currentLevel < 1 || !currentLevel) && level === 1;
            const isCurrentFilled = currentLevel === level || isNotStart;
            const isFinalFilled = isFinalFilledLevel;

            return (
              <LevelItem key={level}>
                <LevelLine>
                  <LevelProgress length={length} filled={isCurrentFilled || isFinalFilled} />
                  <RenderFlag isFinalLevel={isFinalLevel} />
                  <LevelAmount filled={isCurrentFilled || isFinalFilled}>
                    {isCurrentFilled && !isFinalFilled && !isFinalLevel ? (
                      <CurrentFillImg alt="current-filled-img" src={currentFilledSrc} />
                    ) : null}
                    {prizeAmount ? (
                      <span>{`${formatNum(prizeAmount)} ${window._BASE_CURRENCY_}`}</span>
                    ) : (
                      <span>--</span>
                    )}
                  </LevelAmount>
                </LevelLine>
                <LevelDesc
                // ref={(ref) => {
                //   if (descList.current) descList.current[level] = ref;
                // }}
                >
                  <DescText
                    startTradeAmount={startTradeAmount}
                    startDepositAmount={startDepositAmount}
                    nFormatterK={nFormatterK}
                  />
                </LevelDesc>
              </LevelItem>
            );
          },
        )}
      </LevelBox>
    </Container>
  );
}
