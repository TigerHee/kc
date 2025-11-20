/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import { DownOutlined, UpOutlined } from '@kufox/icons';
import _ from 'lodash';
import style from './style.less';

let enabled = true;

const UP = 'UP';
const DOWN = 'DOWN';
const enable = () => {
  enabled = true;
};
const disable = () => {
  enabled = false;
};

export default class ChangingNumber extends React.Component {
  static propTypes = {
    up: PropTypes.string,
    down: PropTypes.string,
    showIcon: PropTypes.bool,
    iconPlacement: PropTypes.oneOf(['left', 'right']),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    up: '#21C397',
    down: '#ED6666',
    showIcon: true,
    iconPlacement: 'left',
    value: null,
    children: null,
  };

  static enable = enable;

  static disable = disable;

  constructor(props) {
    super(props);

    this.state = {
      status: null,
      showBg: false,
    };

    this.reset = _.debounce(() => {
      if (this.bg) {
        this.setState({ showBg: false });
      }
      if (this.resetTs) {
        clearTimeout(this.resetTs);
      }
      this.resetTs = setTimeout(() => {
        if (this.container) {
          this.setState({ status: null });
        }
      }, 3000);
    }, 3000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { value } = this.props;
    const { status, showBg } = this.state;

    return value !== nextProps.value || status !== nextState.status || showBg !== nextState.showBg;
  }

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (enabled && prevProps.value !== null && value !== prevProps.value) {
      const status = this.calculateStatus(prevProps.value);
      if (status) {
        if (this.showBgTs) {
          clearTimeout(this.showBgTs);
        }
        this.showBgTs = setTimeout(() => {
          this.setState({ status, showBg: true });
        }, 0);
        this.reset();
      }
    }
  }

  componentWillUnmount() {
    if (this.showBgTs) {
      clearTimeout(this.showBgTs);
    }
    if (this.resetTs) {
      clearTimeout(this.resetTs);
    }
  }

  showBgTs = null;

  resetTs = null;

  calculateStatus(prevValue) {
    const { value } = this.props;

    if (prevValue === value) {
      return null;
    }
    if (+prevValue < +value) {
      return UP;
    }
    return DOWN;
  }

  getColor() {
    const { up, down } = this.props;
    const { status } = this.state;
    if (status === UP) return up;
    if (status === DOWN) return down;
    return null;
  }

  storeRefContainer = (ref) => {
    this.container = ref;
  };

  container = null;

  storeRefBg = (ref) => {
    this.bg = ref;
  };

  bg = null;

  render() {
    const { children, value, showIcon, iconPlacement } = this.props;
    const { status, showBg } = this.state;
    const color = this.getColor();

    return (
      <span ref={this.storeRefContainer} className={style.changingWrapper}>
        {showBg && (
          <span
            ref={this.storeRefBg}
            className={`${style.changingBg} ${style[iconPlacement]}`}
            // style={{ background: color }}
          />
        )}
        <span className={`${style.changingIcon} ${style[iconPlacement]}`} style={{ color }}>
          {showIcon && status === UP && <UpOutlined />}
          {showIcon && status === DOWN && <DownOutlined />}
        </span>
        <span style={{ color }}>{children !== null ? children : value}</span>
      </span>
    );
  }
}
