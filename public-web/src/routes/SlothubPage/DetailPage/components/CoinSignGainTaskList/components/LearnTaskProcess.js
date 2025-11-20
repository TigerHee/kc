/**
 * Owner: larvide.peng@kupotech.com
 */
import { useMemoizedFn } from 'ahooks';
import { useMemo } from 'react';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import { BACKEND_PROJECT_STATUS_TYPE, LINKS, SENSORS } from 'src/routes/SlothubPage/constant';
import { jumpTo } from 'src/routes/SlothubPage/utils';

import { _t } from 'tools/i18n';
import { useStore } from '../../../store';
import { HorizontalCenterWrap, VerticalWrap } from './AtomComponents/styled';
import { H5ProcessBar, ProcessData, ProcessDesc, ProcessDescItem } from './styled';
import TaskSubmitButton from './TaskSubmitButton';

const SubmitButton = ({ completeTimes, learnJumpCode }) => {
  const { state } = useStore();
  const { status, startTime } = state.projectDetail || {};

  const ButtonStatus = useMemo(() => {
    const now = Date.now();
    // 活动未开始
    if (status === BACKEND_PROJECT_STATUS_TYPE.RUNNING && now < startTime) {
      return {
        disabled: true,
        text: _t('coming.soon'),
      };
    }
    // 活动进行中
    if (status === BACKEND_PROJECT_STATUS_TYPE.RUNNING && now > startTime) {
      return {
        disabled: false,
        text: _t('28f1289e945d4000af60'),
      };
    }
    // 活动已结束
    if (
      status === BACKEND_PROJECT_STATUS_TYPE.ACTIVITY_RESULT_CALC ||
      status === BACKEND_PROJECT_STATUS_TYPE.ENDED
    ) {
      return {
        disabled: true,
        text: completeTimes === 0 ? _t('2b6efb47747d4000a07c') : _t('349ecc4085de4000a74f'), // 活动结束，用户答题完成展示「已完成」 用户未完成展示【已结束】
      };
    }
  }, [status, startTime, completeTimes]);

  const toLink = useMemoizedFn(() => {
    if (ButtonStatus.disabled) {
      return;
    }
    jumpTo(LINKS.learnAndEarn(`/${learnJumpCode}`));
  });

  return (
    <TaskSubmitButton disabled={ButtonStatus.disabled} onPreClick={SENSORS.learn} toLink={toLink}>
      {ButtonStatus.text}
    </TaskSubmitButton>
  );
};

export const LearnTaskProcess = ({ info, currencyName }) => {
  const { isH5 } = useDeviceHelper();
  const { completeTimes, pointsAmount, learnJumpCode } = info || {};
  const [isShowPCGainSignProcess, isShowH5GainSignProcess] = [!isH5, isH5];

  return (
    <VerticalWrap>
      <HorizontalCenterWrap>
        {isShowPCGainSignProcess && (
          <ProcessDescItem>
            <ProcessData>
              <span role="button" tabIndex="0" className="green">
                <NumberFormat>{pointsAmount || 0}</NumberFormat>
              </span>
            </ProcessData>
            <ProcessDesc>{_t('9151c408be494000a846', { token: currencyName })}</ProcessDesc>
          </ProcessDescItem>
        )}

        {!isH5 && <SubmitButton completeTimes={completeTimes} learnJumpCode={learnJumpCode} />}
      </HorizontalCenterWrap>

      {isShowH5GainSignProcess && (
        <H5ProcessBar>
          <ProcessDesc>
            {_t('9151c408be494000a846', { token: currencyName })}
            <span className="green">
              <NumberFormat>{pointsAmount || 0}</NumberFormat>
            </span>
          </ProcessDesc>
          <SubmitButton completeTimes={completeTimes} learnJumpCode={learnJumpCode} />
        </H5ProcessBar>
      )}
    </VerticalWrap>
  );
};
