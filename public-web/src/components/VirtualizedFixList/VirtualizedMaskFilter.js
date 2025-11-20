/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
// import raf from 'raf';
import { Event } from 'helper';

const getWindowRectHeight = () => {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

/**
 * 限制展示范围的滤镜
 *
 * children: ({ rectRef, top, bottom }) => {
 *
 * }
 */
export default class VirtualizedMaskFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rect: { top: 0, bottom: 0 },
    };

    this._getRect = _.throttle(this._getRect, 30);
  }

  mutationObserver = null;

  componentDidMount() {
    const { useWindow } = this.props;
    /** getRect */
    this.getRect();

    // bind
    // Event.addHandler(window, 'resize', this.getRect);
    // Event.addHandler(window, 'scroll', this.getRect);

    Event.addHandler(window, 'resize', this._getRect);
    Event.addHandler(window, 'scroll', this._getRect);

    if (!useWindow) {
      Event.addHandler(this.rectRef, 'scroll', this.rerender);

      // observe
      this.mutationObserver = new MutationObserver(() => {
        // trigger rerender
        this.rerender();
        this.getRect();
      });

      this.mutationObserver.observe(this.rectRef, { attributes: true });
    }
  }

  componentWillUnmount() {
    const { useWindow } = this.props;

    Event.removeHandler(window, 'resize', this.getRect);
    Event.removeHandler(window, 'scroll', this.getRect);

    Event.removeHandler(window, 'resize', this._getRect);
    Event.removeHandler(window, 'scroll', this._getRect);
    if (!useWindow) {
      Event.removeHandler(this.rectRef, 'scroll', this.rerender);

      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  _getRect = () => {
    this.getRect();
  };

  getRect = () => {
    const { useWindow } = this.props;
    if (this.rectRef) {
      let _rect;
      if (useWindow) {
        _rect = {
          top: 0,
          bottom: getWindowRectHeight(),
        };
      } else {
        _rect = this.rectRef.getBoundingClientRect();
      }

      const { top, bottom } = _rect;
      // console.log('run getRect', _rect, 'useWindow', useWindow);
      this.setState({
        rect: { top, bottom },
      });
    }
  };

  handleRectRef = (ref) => {
    const { useWindow } = this.props;
    if (useWindow) {
      this.rectRef = window;
    } else {
      this.rectRef = ref;
    }
  };

  rectRef = null;

  rerender = () => {
    // raf(() => {
    //   // this.forceUpdate();
    //   this.setState({});
    // });
    this.setState({});
  };

  reflow = () => {
    this.getRect();
  };

  render() {
    const { children } = this.props;
    const { rect } = this.state;

    const params = {
      rectRef: this.handleRectRef,
      ...rect,
    };
    return <React.Fragment>{children(params)}</React.Fragment>;
  }
}

if (_DEV_) {
  VirtualizedMaskFilter.propTypes = {
    children: PropTypes.func.isRequired,
    useWindow: PropTypes.bool,
  };
}
