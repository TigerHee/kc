/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import moment from 'moment';

function initTime(props) {
  const targetTime = moment(props.target).valueOf();
  const lastTime = targetTime - moment().valueOf();
  return {
    lastTime: lastTime < 0 ? 0 : lastTime,
  };
}

export default class TimeCountDown extends React.Component {
  timer = 0;

  interval = 1000;

  constructor(props) {
    super(props);
    const { lastTime } = initTime(props);
    this.state = {
      lastTime,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if ('target' in nextProps) {
      return {
        lastTime: initTime(nextProps).lastTime,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const { target } = prevProps;
    if (target !== this.props.target) {
      this.end();
      this.tick();
    }
  }

  componentDidMount() {
    this.tick();
  }

  tick = () => {
    const { onChange, onEnd } = this.props;
    this.timer = window.setInterval(() => {
      const { lastTime } = this.state;
      if (lastTime < this.interval) {
        this.end();
        this.setState(
          {
            lastTime: 0,
          },
          () => {
            if (onEnd) {
              onEnd(this.state.lastTime);
            }
          },
        );
      } else {
        this.setState(
          {
            ...this.state,
            lastTime: lastTime - this.interval,
          },
          () => {
            if (onChange) {
              onChange(this.state.lastTime);
            }
          },
        );
      }
    }, this.interval || 1000);
  };

  end = () => {
    if (this.timer) {
      window.clearInterval(this.timer);
    }
    this.timer = null;
  };

  componentWillUnmount() {
    this.end();
  }

  render() {
    return null;
  }
}
