/**
 * Owner: sean.shi@kupotech.com
 */
import { useMemo } from 'react';
import { find, sortBy } from 'lodash-es';
import { bootConfig } from 'kc-next/boot';
import { Trans } from 'tools/i18n';
import clsx from 'clsx';
import currentFilledSrc from '../../../../../../static/current-filled-img.svg';
import logoSrc from '../../../../../../static/task-tag-logo.svg';
import { useLang, useHtmlToReact } from '../../../../../hookTool';
import { NEW_CUSTOMER_PRIZE_STATUS, NEW_CUSTOMER_TASK_STATUS } from '../../constants';
import { useFormat } from '../../hooks/useFormat';
import { LimitTaskLevel, TaskList, useInviteBenefits } from '../../store';
import styles from './index.module.scss';

const useLimitLevel = (limitTask?: TaskList['tempTask']) => {
  const { limitTaskInfo } = limitTask || {};
  const { limitTaskLevel, userLevel, taskStatus, prizeStatus } = limitTaskInfo || {};

  const { _limitTaskLevel, currentLevelInfo } = useMemo(() => {
    const levels: LimitTaskLevel[] = sortBy(limitTaskLevel || [], i => i.level);
    const currentLevelInfo: LimitTaskLevel | undefined = find(levels, i => i.level === userLevel);
    return { _limitTaskLevel: levels, currentLevelInfo };
  }, [limitTaskLevel, userLevel]);

  const { maxPrizeAmount, maxLevel } = useMemo(() => {
    const maxItem = _limitTaskLevel[_limitTaskLevel.length - 1] || {};
    const { prizeAmount = 0, level } = maxItem;
    return { maxPrizeAmount: prizeAmount, maxLevel: level };
  }, [_limitTaskLevel]);

  const isComplete = taskStatus === NEW_CUSTOMER_TASK_STATUS.COMPLETE;
  const isProcessing = taskStatus === NEW_CUSTOMER_TASK_STATUS.PROCESSING;
  const canCliamPrize = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.WAIT_DRAW;
  const prizeDrawed = prizeStatus === NEW_CUSTOMER_PRIZE_STATUS.DRAWED;

  const data = useMemo(() => {
    return {
      ...(limitTaskInfo || ({} as TaskList['tempTask']['limitTaskInfo'])),
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

const RenderFlag = ({ isFinalLevel }: { isFinalLevel?: boolean }) => {
  return isFinalLevel ? <img className={styles.levelTag} src={logoSrc} alt="current-level-tag" /> : null;
};

export function Level() {
  const { t: _t } = useLang();
  const taskList = useInviteBenefits().taskList;
  const { formatNum, nFormatterK } = useFormat();

  const { subtitle } = taskList?.tempTask?.limitTaskInfo || {};
  const { eles: subtitleReact } = useHtmlToReact({ html: subtitle || '' });
  const subtitleContent = subtitle ? (
    <span>{subtitleReact}</span>
  ) : (
    <Trans
      i18nKey="vDzdN3fTACepGcVvjVBXYv"
      ns="entrance"
      values={{ amount: formatNum(7500), currency: bootConfig._BASE_CURRENCY_ }}
      components={{ span: <span className="highlight" /> }}
    />
  );

  const levelInfo = useLimitLevel(taskList?.tempTask);
  const { maxLevel, currentLevel, limitTaskLevel = [] } = levelInfo;
  const _isCompleteTask = currentLevel && currentLevel >= 1;
  const _isCompleteFinalTask = _isCompleteTask && maxLevel === currentLevel;

  if (!taskList) return null;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{_t('eUV1Qn4Zn88M6AQpFPEzAs')}</div>
      <div className={styles.description}>{subtitleContent}</div>
      <div className={styles.levelBox}>
        {limitTaskLevel?.map(({ level, startDepositAmount, startTradeAmount, prizeAmount }, index: number) => {
          const isFinalLevel = maxLevel && maxLevel === level;
          const isFinalFilledLevel = _isCompleteFinalTask && currentLevel === level;
          const length = 50 + index * 20;
          const isNotStart = (currentLevel < 1 || !currentLevel) && level === 1;
          const isCurrentFilled = currentLevel === level || isNotStart;
          const isFilled = isCurrentFilled || isFinalFilledLevel;
          return (
            <div className={styles.levelItem} key={level}>
              <div className={styles.levelLine}>
                <div className={clsx(styles.levelProgress, isFilled && styles.filled)} style={{ height: `${length}px` }} />
                <RenderFlag isFinalLevel={!!isFinalLevel} />
                <span className={clsx(styles.levelAmount, isFilled && styles.filled)}>
                  {isCurrentFilled && !isFinalFilledLevel && !isFinalLevel ? (
                    <img className={styles.currentFillImg} alt="current-filled-img" src={currentFilledSrc} />
                  ) : null}
                  {prizeAmount ? (
                    <span>{`${formatNum(prizeAmount)} ${bootConfig._BASE_CURRENCY_}`}</span>
                  ) : (
                    <span>--</span>
                  )}
                </span>
              </div>
              <div className={styles.levelDesc}>
                {startTradeAmount <= 0 ? (
                  _t('8EsvHRGtdy7EAcY1akhbWr', {
                    amount: nFormatterK(startDepositAmount),
                    currency: bootConfig._BASE_CURRENCY_,
                  })
                ) : (
                  <Trans
                    i18nKey="sN6Xt4oy7jzsVggBmncbHx"
                    ns="entrance"
                    values={{
                      amount: nFormatterK(startDepositAmount),
                      currency: bootConfig._BASE_CURRENCY_,
                      amount2: nFormatterK(startTradeAmount),
                      currency2: bootConfig._BASE_CURRENCY_,
                    }}
                    components={{ br: <br /> }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Level;
