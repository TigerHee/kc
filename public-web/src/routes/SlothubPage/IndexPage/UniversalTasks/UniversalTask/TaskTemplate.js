/*
 * owner: borden@kupotech.com
 * desc: taskType： 0 邀请  1 kyc  2 交易  3 入金
 *       titleType 0 取模版 1 写死
 *     1. completeTimes > rewardTimes , 就得展示领取。
 *     2. kyc， completeTimes> 0 表示已完成。 completeTimes = rewardTimes 就是已领取
 */
import { useLocale } from '@kucoin-base/i18n';
import { useResponsive } from '@kux/mui';
import Html from 'components/common/Html';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SENSORS } from 'routes/SlothubPage/constant';
import { _t, _tHTML } from 'src/tools/i18n';
import NumberFormat from '../../../components/mui/NumberFormat';
import ReciviceButton from '../../../components/ReciviceButton';
import { STATIC_CUTDOWN } from '../../../constant';
import withAuth from '../../../hocs/withAuth';
import withKyc from '../../../hocs/withKyc';
import useReceiveButton from '../../../hooks/useReceiveButton';
import { jumpToTradeWithSymbol } from '../../../utils';
import {
  Data,
  Desc,
  KycItem,
  Row,
  StyledButton,
  StyledTimeCountDown,
  TaskInfo,
  TaskInfos,
  TaskItem,
  TaskOpration,
  TaskTitle,
  TimeBox,
  TimeLabel,
} from '../style';

const AuthButton = withAuth(
  ({ id, projectId, completeTimes, rewardTimes, children, ...otherProps }) => {
    const dispatch = useDispatch();
    const receiveButton = useReceiveButton({
      projectId,
      taskId: id,
      callback: () => dispatch({ type: 'slothub/pullBasicTasksInfo' }),
    });

    // 可领取次数
    const receiveTimes = completeTimes - rewardTimes;

    if (receiveTimes > 0) {
      return <ReciviceButton receiveTimes={receiveTimes} {...otherProps} {...receiveButton} />;
    }
    return <StyledButton {...otherProps}>{children}</StyledButton>;
  },
);
const KycButton = withKyc((props) => <AuthButton {...props} />, false);

// 任务标题
const TitleRender = ({ titleParams, children }) => {
  const { currentLang } = useLocale();
  const title = titleParams?.[currentLang] || titleParams?.en_US;
  return title ? <Html component="span">{title}</Html> : children;
};

// kyc任务
export const KycTask = (props) => {
  const { sm } = useResponsive();
  const { id, projectId, titleParams, completeTimes, rewardTimes, guidePoints } = props;
  return (
    <KycItem>
      <TaskTitle>
        <TitleRender titleParams={titleParams}>
          {_tHTML('fc27e968b1694000ac26', { a: 10 })}
        </TitleRender>
      </TaskTitle>
      <TaskOpration>
        <KycButton
          id={id}
          projectId={projectId}
          rewardTimes={rewardTimes}
          size={sm ? 'basic' : 'mini'}
          completeTimes={completeTimes}
          onPreClick={SENSORS.basicKyc}
        >
          {_t('8e065a11446c4000ad8f')}
          {guidePoints?.kyc}
        </KycButton>
      </TaskOpration>
    </KycItem>
  );
};

// 交易任务
export const TradeTask = (props) => {
  const {
    id,
    type,
    projectId,
    guidePoints,
    titleParams,
    refreshTime,
    rewardTimes,
    completeTimes,
    taskCompleteValue,
    maxCompletedTimes,
    currentProcessingValue,
  } = props;
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  // 倒计时结束，刷新通用任务面板
  const handleEnd = useCallback(() => {
    dispatch({ type: 'slothub/pullBasicTasksInfo' });
  }, []);

  const toTradePage = useCallback(() => {
    SENSORS.basicTrade();
    jumpToTradeWithSymbol();
  }, []);

  return (
    <TaskItem style={{ alignItems: 'stretch' }}>
      <Row style={{ alignItems: 'flex-start' }}>
        <TaskTitle>
          <TitleRender titleParams={titleParams}>
            {_tHTML('69ce5ae22e8c4000a94c', { a: 100 })}
          </TitleRender>
        </TaskTitle>
        {type === 'cycle' && (
          <TimeBox>
            <TimeLabel>{_t('ec54218212474000ad25')}</TimeLabel>
            <StyledTimeCountDown
              className="ml-4"
              onEnd={handleEnd}
              isH5={!sm}
              config={{ needDays: false }}
              size={sm ? 'basic' : 'small'}
              isStaticValue={!!guidePoints}
              value={guidePoints ? STATIC_CUTDOWN : refreshTime}
              intervalThemeConfig={{
                gapWidth: 2,
                colorTheme: 'dark',
              }}
            />
          </TimeBox>
        )}
      </Row>
      <Row>
        <TaskInfos>
          <TaskInfo>
            <Data>
              <NumberFormat>{currentProcessingValue || 0}</NumberFormat>
              <span className="grey">
                /<NumberFormat>{taskCompleteValue || 0}</NumberFormat> USDT
              </span>
            </Data>
            <Desc>{_t('8dc5b585e3994000a67a')}</Desc>
          </TaskInfo>
          <TaskInfo>
            <Data>
              <NumberFormat>{rewardTimes}</NumberFormat>
              <span className="grey">
                /<NumberFormat>{maxCompletedTimes}</NumberFormat>
              </span>
            </Data>
            <Desc>{_t('0d968e96fa614000a258')}</Desc>
          </TaskInfo>
        </TaskInfos>
        <AuthButton
          id={id}
          onClick={toTradePage}
          projectId={projectId}
          rewardTimes={rewardTimes}
          size={sm ? 'basic' : 'mini'}
          completeTimes={completeTimes}
        >
          {_t('263d5b89052e4000acaa')}
          {guidePoints?.trade}
        </AuthButton>
      </Row>
    </TaskItem>
  );
};
