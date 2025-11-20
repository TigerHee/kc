/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import React from 'react';
import PropTypes from 'prop-types';
import style from './style.less';

export default class NumberRemainBox extends React.Component {

  static propTypes = {
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    direction: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    direction: NumberRemainBox.UP,
  };

  static UP = 0;
  static DOWN = 1;

  state = {
    nums: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { number, direction } = nextProps;
    if (number !== prevState._number) {
      const newNums = direction === NumberRemainBox.UP ?
        [prevState.nums[1], number] : [number, prevState.nums[0]];
      return {
        nums: newNums,
        _number: number,
      };
    }
    return null;
  }

  render() {
    const { className, number, direction } = this.props;
    const { nums } = this.state;
    // const innerClassName = direction === NumberRemainBox.UP ? style.up : style.down;

    return (
      <div
        className={`${style.outter} ${className}`}
        data-role="number-remain-outter"
      >
        <div
          key={`in-${number}`}
          className={`${style.inner}`}
          data-role="number-remain-inner"
        >
          {map(nums, (num) => {
            return (
              <div
                key={`${num}`}
                className={style.number}
              >
                { num }
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
