/**
 * Owner: willen@kupotech.com
 */
/**
 * 2018-11-02
 * TimerButton
 * 用于倒计时，倒数时一切事件无效
 */

import React from 'react';
import { LoadingOutlined } from '@kufox/icons';
import { _t } from 'tools/i18n';
import { evtEmitter } from 'helper';
import PropTypes from 'prop-types';
import storage from 'utils/storage';
import { injectLocale } from '@kucoin-base/i18n';

// import { Button } from '@kc/ui/lib/button';

const noop = (resolve) => {
  resolve();
};
const event = evtEmitter.getEvt();

const OneMinLong = 60 * 1000;

@injectLocale
class TimerButton extends React.Component {
  constructor(props) {
    super(props);
    const btnId = `${props.id}__${props.bizType}`;
    const _cache = storage.getItem(btnId);

    let _count = props.timeDelay;
    let isCounting = false;
    const now = Date.now();

    const { count, timestamp } = _cache || {};

    if (_cache && count > 0 && Math.abs(timestamp - now) + count * 1000 < OneMinLong) {
      // eslint-disable-next-line
      _count = (_cache.count - Math.abs(timestamp - now) / 1000) | 1;
      _count = _count > 0 ? _count : props.timeDelay;
      storage.removeItem(btnId);
      isCounting = _count > 0;
    }

    this.state = {
      count: _count,
      tried: false,
      success: false,
    };
    this.count = this.count.bind(this);

    if (isCounting) {
      this.count();
    }

    this._countStart = this._countStart.bind(this);
    this._countSuccess = this._countSuccess.bind(this);
  }

  timer = null;

  _countStart({ send, id, delay = 60 }) {
    if (id !== this.props.id) {
      return;
    }
    this.setState({
      count: delay,
    });
    if (send && this) {
      const { countTimeBegin } = this.props || {};
      if (countTimeBegin) countTimeBegin();
      this.count();
    } else {
      console.log('reject ,not count');
    }
  }

  _countSuccess({ success, id }) {
    const self = this;
    if (id !== self.props.id) {
      return;
    }
    if (success && self) {
      self.setState({
        success: true,
      });
    }
  }

  componentDidMount() {
    // const self = this;
    event.on('__TIMER_BTN_COUNT_START__', this._countStart);
    event.on('__TIMER_BTN_COUNT_SUCCESS__', this._countSuccess);
  }

  // componentWillUnmount()

  componentWillUnmount() {
    const { count, success } = this.state;
    const { id, bizType } = this.props;
    const btnId = `${id}__${bizType}`;

    event.off('__TIMER_BTN_COUNT_START__', this._countStart);
    event.off('__TIMER_BTN_COUNT_SUCCESS__', this._countSuccess);

    if (count > 0 && count < this.props.timeDelay && !success) {
      storage.setItem(btnId, {
        count,
        timestamp: Date.now(),
      });
    }
    clearTimeout(this.timer);

    this.timer = null;
  }

  handleClick = (evt) => {
    const { onClick, countAfterClick = false, timeDelay } = this.props;
    const { count } = this.state;
    if (count < timeDelay) {
      return;
    }
    if (countAfterClick) {
      this.count();
    }
    onClick(evt);
  };

  /**
   * 倒计时
   */
  count = () => {
    const { timeDelay, id, bizType, countTimeOver } = this.props;
    const { count } = this.state;
    if (!this || !this.setState) {
      return;
    }
    this.setState({
      count: count - 1,
    });

    if (count - 1 <= 0) {
      this.setState({
        count: timeDelay,
        tried: true,
      });
      storage.removeItem(`${id}__${bizType}`);
      if (countTimeOver) countTimeOver();
    } else {
      this.timer = setTimeout(this.count, 1000);
    }
  };

  render() {
    const { text, loading, disabled, timeDelay, countAfterClick, bizType, ...restProps } =
      this.props;
    const { count, tried } = this.state;
    let displayWord = '';
    if (count < timeDelay) {
      displayWord = `${count} s`;
    } else if (tried) {
      displayWord = _t('send');
    } else {
      displayWord = text || _t('send');
    }
    return (
      <React.Fragment>
        <span
          {...restProps}
          style={{
            pointerEvents: count < timeDelay || loading || disabled ? 'none' : 'all',
            color: disabled ? '#ccc' : '',
          }}
          onClick={this.handleClick}
        >
          {displayWord}
          {loading ? <LoadingOutlined /> : ''}
        </span>
      </React.Fragment>
    );
  }
}

TimerButton.defaultProps = {
  timeDelay: 60,
  onClick: noop,
  countAfterClick: false,
  bizType: 'DEFAULT',
};

TimerButton.propTypes = {
  id: PropTypes.string, // TimerButton 唯一id，根据id接受信号
  countAfterClick: PropTypes.bool.isRequired, // 是否在点击后直接开始计数，不需要等待回调信号
  onClick: PropTypes.func, // 点击事件处理函数
  timeDelay: PropTypes.number.isRequired, // 计数值， 默认计数60
  text: PropTypes.string, // 默认显示的文字
  bizType: PropTypes.string, // 指定用于倒计时的业务，用于与id进行唯一匹配
};

export default TimerButton;
