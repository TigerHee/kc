/**
 * Owner: willen@kupotech.com
 */
/* eslint-disable func-names */

import React from 'react';

// import raf from 'raf';

let winHeight =
  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

const getWindowRectHeight = (force = false) => {
  if (!force) {
    console.log(' use cache ');
    return winHeight;
  }
  winHeight =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  return winHeight;
};

const requestFrame = (function () {
  const raf =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function (fn) {
      return window.setTimeout(fn, 20);
    };
  return function (fn) {
    return raf(fn);
  };
})();

(function () {
  const cancel =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.clearTimeout;
  return function (id) {
    return cancel(id);
  };
})();

export default class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rect: {
        top: 0,
        bottom: 969,
      },
      isScrolling: false,
      initOffsetTop: 0,
      scrollTop: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
    this._handleScroll = this._handleScroll.bind(this);
    // this._handleScroll = _.throttle(this._handleScroll, 5, { leading: true });
    // this._handleScroll = _.debounce(this._handleScroll, 10, { trailing: true });
  }

  ref = null;

  scrollTimer = null;

  scrollTop = 0;

  componentDidMount() {
    this.calcInitOffsetTop();
    setTimeout(() => {
      document.scrollingElement.scroll(0, -5);
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      // Event.addHandler(window, 'scroll', this.handleScroll);
    }, 50);

    document.addEventListener('resize', this.calcVisibleRect);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.calcVisibleRect);
    // Event.removeHandler(window, 'scroll', this.handleScroll);
  }

  calcInitOffsetTop() {
    const { top } = this.ref.getBoundingClientRect();
    const { scrollTop } = document.scrollingElement;
    this.setState({
      initOffsetTop: scrollTop + top,
    });
  }

  handleScroll(e) {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }

    if (!this.isScrolling) {
      this.isScrolling = true;
    }
    this.scrollTimer = setTimeout(() => {
      this.isScrolling = false;
      this.scrollTimer = null;
      this.setState({
        scrollTop: window.document.scrollingElement.scrollTop,
      });
    }, 10);

    requestFrame(() => {
      this._handleScroll(e);
    });
    // this._handleScroll(e);
  }

  async _handleScroll(e) {
    const { isScrolling } = this.state;
    const { scrollTop } = e.target.documentElement;
    this.setState({
      scrollTop,
    });
    this.scrollTop = scrollTop;
    if (this.scrollTimer || isScrolling) {
      clearTimeout(this.scrollTimer);
    }
  }

  // 计算可视区域的大小
  calcVisibleRect(scrollTop) {
    const { datasourceLen, rowHeight } = this.props;
    const { initOffsetTop } = this.state;
    //
    const _rect = {
      top: 0,
      bottom: 0,
    };
    const _wh = getWindowRectHeight();
    const filterHeight = datasourceLen * rowHeight;
    if (scrollTop < initOffsetTop) {
      _rect.top = initOffsetTop - scrollTop;
    } else {
      _rect.top = 0;
    }
    const _top = initOffsetTop + filterHeight;
    if (scrollTop > _top && filterHeight > _wh) {
      _rect.bottom = _wh - (_top - scrollTop);
    } else if (filterHeight > _wh) {
      _rect.bottom = _wh;
    } else {
      _rect.bottom = _top;
    }
    this.setState({
      rect: { ..._rect },
    });
  }

  render() {
    const { children } = this.props;
    const { rect, initOffsetTop, scrollTop } = this.state;
    return (
      <div
        ref={(el) => {
          this.ref = el;
        }}
      >
        {children({
          ...rect,
          scrollTop,
          initOffsetTop,
        })}
      </div>
    );
  }
}
