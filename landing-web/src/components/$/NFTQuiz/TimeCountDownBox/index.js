/**
 * Owner: jesse.shao@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import NumberRemainBox from './NumberRemainBox';
import style from './style.less';

const TIME_DESC = ['D', 'H', 'M', 'S'];
const noop = () => { };

export default class TimeCountDownBox extends React.Component {
  static propTypes = {
    restSec: PropTypes.number,
    className: PropTypes.string,
    numberBoxClassName: PropTypes.string,
    handleCountEnd: PropTypes.func,
    handleCountChange: PropTypes.func,
  };

  static defaultProps = {
    restSec: 0,
    className: '',
    numberBoxClassName: '',
    handleCountEnd: noop,
    handleCountChange: noop,
  };

  constructor(props) {
    super(props);

    this.state = {
      num: props.restSec,
    };
  }

  componentDidMount() {
    this.initInterval();
  }

  componentDidUpdate(prevProps) {
    const { restSec, handleCountChange } = this.props;
    if (restSec !== prevProps.restSec) {
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        num: restSec,
      }, () => {
        this.initInterval();
        if (typeof handleCountChange === 'function') {
          handleCountChange(restSec);
        }
      });
    }
  }

  initInterval = () => {
    this.cleanInterval();
    this.timer = setInterval(() => {
      const num = this.state.num - 1;
      if (num >= 0) {
        this.setState({
          num,
        }, () => {
          const { handleCountChange } = this.props;
          if (typeof handleCountChange === 'function') {
            handleCountChange(num);
          }
        });
      } else {
        this.cleanInterval();
        // trigger counter end
        const { handleCountEnd } = this.props;
        if (typeof handleCountEnd === 'function') {
          handleCountEnd();
        }
      }
    }, 1000);
  }

  cleanInterval = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  getTimeData = (totalSeconds) => {
    const data = [0, 0, 0];
    if (!totalSeconds) {
      return data;
    }
  
    data[0] = Math.floor(totalSeconds / 3600); // 时
    totalSeconds %= 3600;
    data[1] = Math.floor(totalSeconds / 60); // 分
    data[2] = totalSeconds % 60; // 秒
  
    data[0] = _.padStart(data[0], 2, '0');
    data[1] = _.padStart(data[1], 2, '0');
    data[2] = _.padStart(data[2], 2, '0');
  
    return data;
  };

  componentWillUnmount() {
    this.cleanInterval();
  }

  render() {
    const { className, numberBoxClassName, plainTextMod } = this.props;
    const { num } = this.state;

    const numArr = this.getTimeData(num);
    const boxCommonProps = {
      className: `${style.box} ${numberBoxClassName}`,
      direction: NumberRemainBox.DOWN,
    };

    if (typeof plainTextMod === 'function') {
      const nArr = _.map(numArr, (item, index) => {
        const pad = _.padStart(item, 2, '0');
        return `${pad[0]}${pad[1]}`;
      })
      return (
        <span className={className}>
          {plainTextMod(nArr)}
        </span>
      );
    }

    return (
      <div className={`${className} ${style.countdown}`}>
        {_.map(numArr, (item, index) => {
          const pad = _.padStart(item, 2, '0');
          return (
            <>
              <div key={index} className={style.group}>
                <NumberRemainBox
                  number={pad}
                  {...boxCommonProps}
                />
                <div className={style.desc}>{TIME_DESC[index + 1]}</div>
              </div>
              {
                index !== (numArr.length -1) && (
                  <span className={style.spliter}>
                    :
                  </span>
                )
              }
            </>
          );
        })}
      </div>
    );
  }
}
