/*
 * @Date: 2024-05-29 15:08:51
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */

import { useMemoizedFn } from 'ahooks';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import { LINKS, SENSORS } from 'src/routes/SlothubPage/constant';
import { jumpTo } from 'src/routes/SlothubPage/utils';
import { _t } from 'src/tools/i18n';
import { useStore } from '../../../store';
import { HorizontalCenterWrap, VerticalWrap } from './AtomComponents/styled';
import {
  EqualRadioProcessDescItem,
  H5ProcessBar,
  ProcessData,
  ProcessDesc,
  ProcessDescItem,
} from './styled';
import TaskSubmitButton from './TaskSubmitButton';
const SubmitButton = ({ completeTimes, rewardTimes, id, maxCompletedTimes }) => {
  // 可领取次数
  const canReceiveTimes = completeTimes - rewardTimes;
  const isFinish = (completeTimes === rewardTimes) === maxCompletedTimes;
  const { state } = useStore();
  const { currency } = state.projectDetail || {};

  const toDepositPage = useMemoizedFn(() => {
    jumpTo(LINKS.deposit(currency));
  });

  return (
    <TaskSubmitButton
      onPreClick={() => SENSORS.deposit({ currency })}
      taskId={id}
      isFinish={isFinish}
      canReceiveTimes={canReceiveTimes}
      toLink={toDepositPage}
    >
      {_t('ad705a41bac94000ad04')}
    </TaskSubmitButton>
  );
};
export const DepositTaskProcess = ({ info, currencyName }) => {
  const { isH5 } = useDeviceHelper();
  const [isShowPCGainSignProcess, isShowH5GainSignProcess] = [!isH5, isH5];

  const {
    currentProcessingValue,
    taskCompleteCurrency,
    taskCompleteValue,
    maxCompletedTimes,
    pointsAmount,
    rewardTimes,
    completeTimes,
    id,
    params,
  } = info;

  const btnProps = { completeTimes, rewardTimes, id, maxCompletedTimes };

  return (
    <VerticalWrap>
      <HorizontalCenterWrap>
        <EqualRadioProcessDescItem>
          <ProcessData>
            <NumberFormat>{currentProcessingValue || 0}</NumberFormat>
            <span className="grey">
              /<NumberFormat>{taskCompleteValue || 0}</NumberFormat> {taskCompleteCurrency}
            </span>
          </ProcessData>
          <ProcessDesc>{_t('cfdcc56e75aa4000a79f')}</ProcessDesc>
        </EqualRadioProcessDescItem>

        <EqualRadioProcessDescItem>
          <ProcessData>
            {rewardTimes}
            <span className="grey">
              /<NumberFormat>{maxCompletedTimes}</NumberFormat>
            </span>
          </ProcessData>
          <ProcessDesc>{_t('0d968e96fa614000a258')}</ProcessDesc>
        </EqualRadioProcessDescItem>

        {isShowPCGainSignProcess && (
          <ProcessDescItem>
            <ProcessData>
              <span className="green">
                <NumberFormat>{pointsAmount}</NumberFormat>
              </span>
            </ProcessData>
            <ProcessDesc>{_t('9151c408be494000a846', { token: currencyName })}</ProcessDesc>
          </ProcessDescItem>
        )}

        {!isH5 && <SubmitButton {...btnProps} />}
      </HorizontalCenterWrap>

      {isShowH5GainSignProcess && (
        <H5ProcessBar>
          <ProcessDesc>
            {_t('9151c408be494000a846', { token: currencyName })}
            <span className="green">
              <NumberFormat>{pointsAmount}</NumberFormat>
            </span>
          </ProcessDesc>
          <SubmitButton {...btnProps} />
        </H5ProcessBar>
      )}
    </VerticalWrap>
  );
};
