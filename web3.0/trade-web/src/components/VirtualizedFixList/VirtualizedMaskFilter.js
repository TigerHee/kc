/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import raf from 'raf';
import { Event } from 'helper';
import ScrollTopContext from './Context';

const getWindowRectHeight = () => {
  return window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
};

const HookContext = React.createContext({});

/**
 * 限制展示范围的滤镜
 */
export default class VirtualizedMaskFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollTop: 0,
      toggleReflow: false,
      rect: { top: 0, bottom: 0 },
    };
    const { useWindow } = props;
    if (!useWindow) {
      // observe
      this.mutationObserver = new MutationObserver(() => {
        // trigger
        this.getRect();
      });
    }
  }

  mutationObserver = null;

  componentDidMount() {
    const { useWindow } = this.props;
    /** getRect */
    this.getRect();

    // bind
    Event.addHandler(window, 'resize', this._getRect);
    Event.addHandler(window, 'scroll', this._getRect, { passive: true });
  }

  componentWillUnmount() {
    const { useWindow } = this.props;

    Event.removeHandler(window, 'resize', this._getRect);
    Event.removeHandler(window, 'scroll', this._getRect);
  }

  _getRect = () => {
    this.getRect();
  }

  getRect = _.throttle(() => {
    raf(() => {
      if (this.getBounding) {
        return;
      }
      this.getBounding = true;

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

        const scrollTop = this.rectRef.scrollTop;
        const { top, bottom } = _rect;
        // console.log('run getRect', _rect, 'useWindow', useWindow);
        this.setState({
          scrollTop,
          rect: { top, bottom },
        });
      }

      this.getBounding = false;
    });
  }, 16);
  getBounding = false;

  getScroll = _.throttle(() => {
    raf(() => {
      if (this.getScrolling) {
        return;
      }
      this.getScrolling = true;

      if (this.rectRef) {
        const scrollTop = this.rectRef.scrollTop;
        this.setState({
          scrollTop,
        });
      }
      this.getScrolling = false;
    });
  }, 16);
  getScrolling = false;

  bindRectRef = (ref) => {
    const { useWindow } = this.props;

    if (!useWindow) {
      Event.addHandler(ref, 'scroll', this.getScroll, { passive: true });
      this.mutationObserver.observe(ref, { attributes: true });
    }
  }

  unbindRectRef = (ref) => {
    const { useWindow } = this.props;
    if (!useWindow) {
      Event.removeHandler(ref, 'scroll', this.getScroll);
      this.mutationObserver.disconnect();
    }
  }

  handleRectRef = (ref) => {
    const { useWindow } = this.props;
    if (useWindow) {
      this.rectRef = window;
    } else {
      this.rectRef = ref;
    }
  };
  rectRef = null;

  reflow = () => {
    raf(() => {
      this.getRect();
      this.setState({
        toggleReflow: !this.state.toggleReflow,
      });
    });
  };

  render() {
    const { children } = this.props;
    const { rect, scrollTop, toggleReflow } = this.state;

    return (
      <HookContext.Provider
        value={{
          handleRectRef: this.handleRectRef,
          bindRectRef: this.bindRectRef,
          unbindRectRef: this.unbindRectRef,
        }}
      >
        <ScrollTopContext.Provider
          value={{
            ...rect,
            scrollTop,
            toggleReflow,
          }}
        >
          {children}
        </ScrollTopContext.Provider>
      </HookContext.Provider>
    );
  }
}

/**
 * 用于绑定ref
 */
VirtualizedMaskFilter.RectBindHook = ({ children, ...otherProps }) => {
  const {
    handleRectRef,
    bindRectRef,
    unbindRectRef,
  } = useContext(HookContext);

  return (
    <BindHook
      handleRectRef={handleRectRef}
      bindRectRef={bindRectRef}
      unbindRectRef={unbindRectRef}
      {...otherProps}
    >
      {children}
    </BindHook>
  );
};

class BindHook extends React.Component {
  componentDidMount() {
    const { bindRectRef } = this.props;

    if (typeof bindRectRef === 'function') {
      bindRectRef(this.rectBindRef);
    } else {
      console.warn('INVALID bindRectRef');
    }
  }

  componentWillUnmount() {
    const { unbindRectRef } = this.props;

    if (typeof unbindRectRef === 'function') {
      unbindRectRef(this.rectBindRef);
    } else {
      console.warn('INVALID unbindRectRef');
    }
  }

  setRef = (ref) => {
    const { handleRectRef, hookRef } = this.props;

    this.rectBindRef = ref;

    if (typeof handleRectRef === 'function') {
      handleRectRef(ref);
    } else {
      console.warn('INVALID handleRectRef');
    }
    if (typeof hookRef === 'function') {
      hookRef(ref);
    }
  };
  rectBindRef = null;

  render() {
    const {
      /** used */
      handleRectRef,
      bindRectRef,
      unbindRectRef,
      hookRef,
      /** down */
      children,
      ...otherProps
    } = this.props;
    return (
      <div ref={this.setRef} {...otherProps}>
        {children}
      </div>
    );
  }
}

if (_DEV_) {
  VirtualizedMaskFilter.propTypes = {
    useWindow: PropTypes.bool,
  };
}
