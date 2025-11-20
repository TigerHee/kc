/**
 * Owner: clyne@kupotech.com
 */
import { connect } from 'dva';
import moment from 'moment';
import raf from 'raf';
import React from 'react';
import { _t } from 'src/utils/lang';
import Hover from './Hover';

@connect((state) => {
  return {
    serverTime: state.server_time.serverTime,
  };
})
class SettlementCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: null,
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { settleDate, serverTime } = this.props;
    let diff = moment(settleDate).diff(serverTime) + 60000;
    if (diff < 0) {
      diff = 0;
    }

    this.setState(
      {
        duration: moment.duration(diff),
      },
      this.countdownStart,
    );
  };

  countdownStart = () => {
    raf.cancel(this.rafTicker);
    const { onTime30m } = this.props;
    const { duration } = this.state;
    let timeTag = moment();
    const ticker = () => {
      const now = moment();
      const diff = now.diff(timeTag);
      if (now - timeTag > 1000) {
        duration.subtract(diff);
        // 距离交割还剩30m的时候，将指数变为预交割价格
        const durationValue = duration.valueOf();
        if (durationValue <= 1800000) {
          onTime30m();
        }
        if (durationValue <= 0) {
          return;
        }
        this.setState({
          duration,
        });
        timeTag = now;
      }
      this.rafTicker = raf(ticker);
    };

    this.rafTicker = raf(ticker);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.settleDate !== this.props.settleDate) {
      this.init();
    }
  }

  duRender = () => {
    const { duration } = this.state;
    return (
      duration &&
      `${this.format(Math.floor(duration.asDays()))}${_t('settle.d')}${this.format(
        duration.hours(),
      )}${_t('settle.h')}${this.format(duration.minutes())}${_t('settle.m')}`
    );
  };

  format = (v) => {
    return v < 10 ? `0${v}` : v;
  };

  componentWillUnmount() {
    raf.cancel(this.rafTicker);
  }

  render() {
    const { settleDate, isMobile, type } = this.props;

    return (
      <React.Fragment>
        {!isMobile && (
          <Hover>
            {(hover) => {
              return (
                <div className="hover">
                  <React.Fragment>
                    <div className="title">{_t('settle.range')}</div>
                    <div className="value">{this.duRender()}</div>
                  </React.Fragment>
                  {/* <React.Fragment>
                    <div className="title">{_t('settle.date')}</div>
                    <div className="value">{moment(settleDate).format('MM-DD HH:mm:ss')}</div>
                  </React.Fragment> */}
                </div>
              );
            }}
          </Hover>
        )}
        {isMobile && (
          <React.Fragment>
            {type === 'range' && <span>{this.duRender()}</span>}
            {type === 'date' && <span>{moment(settleDate).format('MM-DD HH:mm:ss')}</span>}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
export default SettlementCountdown;
