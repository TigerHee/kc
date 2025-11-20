/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import { _t } from 'src/utils/lang';
import { separateNumber } from 'helper';
import useLastTime, { formatCountDownTime } from 'src/components/$/Prediction/useLastTime';
import { Content, Header, BodyWrapper, TimeTip, CountDown, TimeNumber } from './StyledComps';
import PrizePool from './PrizePool';
import Status from './Status';

const NotStartCountDown = ({ data, onCountDownFinish }) => {
  const { start, now, id } = data;
  const lastTime = useLastTime({ start: now, end: start });
  const { d, h, m, s } = formatCountDownTime(lastTime);
  const TimeItem = ({ number, text }) => (
    <TimeNumber>
      <div className="time">{number}</div>
      <div className="textTime">{text}</div>
    </TimeNumber>
  );
  useEffect(
    () => {
      if (lastTime <= 0 && id) {
        // 派发获取最新请求
        isFunction(onCountDownFinish) && onCountDownFinish();
      }
    },
    [lastTime, onCountDownFinish, id],
  );
  return (
    <Fragment>
      {Number(d) > 0 ? (
        <CountDown>
          <TimeItem number={d} text="D" />:<TimeItem number={h} text="H" />:
          <TimeItem number={m} text="M" />
        </CountDown>
      ) : (
        <CountDown>
          <TimeItem number={h} text="H" />:<TimeItem number={m} text="M" />:
          <TimeItem number={s} text="S" />
        </CountDown>
      )}
    </Fragment>
  );
};

// 未开始卡片
const NotStartCard = ({ round = {}, onCountDownFinish, onShowTipDialog }) => {
  const {  closeTimeText, bigPrize } = round;

  return (
    <Content className="noStart">
      <Header className="statusHeader" showGreenBg>
        <Status
          isActive
          time={closeTimeText}
          onTipClick={onShowTipDialog}
          text={_t('prediction.notStart')}
        />
      </Header>
      <BodyWrapper className="noStartWrapper">
        <PrizePool number={separateNumber(bigPrize.amount || 0)} />
        <TimeTip>{_t('prediction.toStart')}</TimeTip>
        <NotStartCountDown data={round} onCountDownFinish={onCountDownFinish} />
      </BodyWrapper>
    </Content>
  );
};

NotStartCard.propTypes = {
  round: PropTypes.object, // 场次
  onCountDownFinish: PropTypes.func.isRequired, // 倒计时结束后回调
  onShowTipDialog: PropTypes.func.isRequired, // 点击小问号时的回调
};

NotStartCard.defaultProps = {
  round: {},
  onCountDownFinish: () => {},
  onShowTipDialog: () => {},
};

export default NotStartCard;
