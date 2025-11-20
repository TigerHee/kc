/**
 * Owner: roger@kupotech.com
 */
 
import throttle from 'lodash-es/throttle';
import React, { useContext } from 'react';
import raf from 'raf';
import ScrollTopContext from './Context';

const getWindowRectHeight = () => {
  // if (typeof window === 'undefined') {
  //   return 0;
  // }
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

interface IHookContext {
  handleRectRef?: (ref: HTMLElement) => void;
  bindRectRef?: (ref: HTMLElement) => void;
  unbindRectRef?: (ref: HTMLElement) => void;
}

const HookContext = React.createContext<IHookContext>({});

interface VirtualizedMaskFilterProps {
  useWindow?: boolean;
  children: React.ReactNode;
}

interface VirtualizedMaskFilterState {
  scrollTop: number;
  toggleReflow: boolean;
  rect: { top: number; bottom: number };
}

/**
 * 限制展示范围的滤镜
 */
export default class VirtualizedMaskFilter extends React.Component<VirtualizedMaskFilterProps, VirtualizedMaskFilterState> {
  private mutationObserver: MutationObserver | null = null;
  private rectRef: any = null;

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

  componentDidMount() {
    /** getRect */
    this.getRect();

    // bind
    window.addEventListener('resize', this._getRect);
    window.addEventListener('scroll', this._getRect, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._getRect);
    window.removeEventListener('scroll', this._getRect)
  }

  // eslint-disable-next-line react/sort-comp
  _getRect = () => {
    this.getRect();
  };

  getRect = throttle(() => {
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

        const { scrollTop } = this.rectRef;
        const { top, bottom } = _rect;

        // TODO 临时处理，后续需要改正，这只是一个临时的 hack 处理 @john zhang
        if(top > 500) {
          this.setState({
            scrollTop,
            rect: { top: 208, bottom },
          });
        }else{
          this.setState({
            scrollTop,
            rect: { top, bottom },
          });
        }
      }

      this.getBounding = false;
    });
  }, 16);

  getBounding = false;

  getScroll = throttle(() => {
    raf(() => {
      if (this.getScrolling) {
        return;
      }
      this.getScrolling = true;

      if (this.rectRef) {
        const { scrollTop } = this.rectRef;
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
      ref.addEventListener('scroll', this.getScroll, { passive: true })
      this.mutationObserver?.observe(ref, { attributes: true });
    }
  };

  unbindRectRef = (ref) => {
    const { useWindow } = this.props;
    if (!useWindow) {
      ref.removeEventListener('scroll', this.getScroll)
      this.mutationObserver?.disconnect();
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

  reflow = () => {
    raf(() => {
      this.getRect();
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
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

// @ts-ignore
VirtualizedMaskFilter.RectBindHook = ({ children, ...otherProps }) => {
  const { handleRectRef, bindRectRef, unbindRectRef } = useContext(HookContext);

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

interface BindHookProps extends IHookContext {
  hookRef?: (ref: HTMLElement) => void;
  children?: React.ReactNode;
}

class BindHook extends React.Component<BindHookProps> {
  private rectBindRef: any = null;
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