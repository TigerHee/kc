/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import style from './style.less';
import TimeCountDown from 'components/common/TimeCountDown';
import { showDatetime } from 'helper';
import { _t } from 'tools/i18n';
import moment from 'moment';
import { ActivityStatus } from 'config/base';
import { injectLocale } from '@kucoin-base/i18n';

const format = 'YYYY-MM-DD HH:mm:ss';

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

function initTime(props) {
  const targetTime = moment(props.target).valueOf();
  const lastTime = targetTime - moment().valueOf();
  return {
    lastTime: lastTime < 0 ? 0 : lastTime,
  };
}

@injectLocale
export default class CountDownBox extends React.Component {
  constructor(props) {
    super(props);
    const target = props.campaignResponse.endTime || 0;
    this.state = {
      lastTime: initTime({ target }).lastTime,
    };
  }

  forMatTime = () => {
    const { lastTime } = this.state;
    const d = fixedZero(Math.floor(lastTime / 1000 / 60 / 60 / 24));
    const h = fixedZero(Math.floor((lastTime / 1000 / 60 / 60) % 24));
    const m = fixedZero(Math.floor((lastTime / 1000 / 60) % 60));
    const s = fixedZero(Math.floor((lastTime / 1000) % 60));
    return { d, h, m, s };
  };

  handleTimeChange = (lastTime) => {
    this.setState({
      lastTime,
    });
  };

  render() {
    const {
      campaignResponse: { endTime, status },
    } = this.props;
    if (status !== ActivityStatus.PROCESSING) {
      return null;
    }
    const { d, h, m, s } = this.forMatTime();
    return (
      <div className={style.countDownBox}>
        <p className={style.tip}>{_t('vote.end.time', { time: showDatetime(endTime, format) })}</p>
        <p className={style.time}>
          {d} : {h} : {m} : {s}
        </p>
        <TimeCountDown
          target={endTime}
          onChange={this.handleTimeChange}
          onEnd={this.handleTimeChange}
        />
      </div>
    );
  }
}
