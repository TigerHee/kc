/**
 * Owner: roger@kupotech.com
 */
import throttle from 'lodash-es/throttle';
import React, { useContext, type RefObject, type CSSProperties, type FC } from 'react';
import raf from 'raf';
import ScrollTopContext from './Context';

interface VirtualizedListProps {
  data: any;
  scrollTop?: number;
  maskFilterRectTop?: number;
  maskFilterRectBottom?: number;
  parentToggleReflow?: number;
  showRender: Function;
  noRowsRender: Function;
  rowHeight: number;
  bufferSize: number;
  style?: CSSProperties;
}

interface VirtualizedListState {
  rect: { top: number; bottom: number };
}

const _hasRecord = data => data && data.length > 0;

class VirtualizedList extends React.Component<VirtualizedListProps, VirtualizedListState> {
  private mutationObserver: MutationObserver | null;
  private listRef: RefObject<HTMLDivElement | null>;

  /** 缓冲部分大小 */
  static BUFFER_SIZE = 5;

  constructor(props) {
    super(props);

    this.state = {
      rect: { top: 0, bottom: 0 },
    };
    this.mutationObserver = null;
    this.listRef = React.createRef();
  }

  componentDidMount() {
    /** getRect */
    this.getRect();

    // bind
    window.addEventListener('resize', this._getRect);
    window.addEventListener('scroll', this._getRect, { passive: true });

    // observe
    this.mutationObserver = new MutationObserver(() => {
      this.rerender();
    });

    this.mutationObserver.observe(this.listRef.current!, { attributes: true });
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (
      (prevProps.data !== data && !_hasRecord(prevProps.data) && _hasRecord(data)) ||
      (prevProps.data && data && prevProps.data.length !== data.length) ||
      prevProps.scrollTop !== this.props.scrollTop ||
      prevProps.maskFilterRectTop !== this.props.maskFilterRectTop ||
      prevProps.maskFilterRectBottom !== this.props.maskFilterRectBottom ||
      prevProps.parentToggleReflow !== this.props.parentToggleReflow
    ) {
      this.rerender();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._getRect);
    window.removeEventListener('scroll', this._getRect);

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
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

      if (this.listRef.current) {
        const { top, bottom } = this.listRef.current.getBoundingClientRect();
        this.setState({
          rect: { top, bottom },
        });
      }

      this.getBounding = false;
    });
  }, 16);

  getBounding = false;

  rerender = () => {
    this.getRect();
  };

  getStateFromProps = (props: VirtualizedListProps) => {
    const { rowHeight, data, maskFilterRectTop, maskFilterRectBottom, bufferSize } = props;

    const { top, bottom } = this.getRectFromRef();

    let listHeight = 0;
    let showHeight = 0;
    let showData = [];
    let offsetTop = 0;
    let offsetBottom = 0;
    const hasRecord = _hasRecord(data);
    const dataLength = hasRecord ? data.length : 0;

    if (hasRecord) {
      listHeight = dataLength * rowHeight;

      // 有要显示的部分
      if (
        !(
          (top <= maskFilterRectTop! && bottom <= maskFilterRectTop!) ||
          (top >= maskFilterRectBottom! && bottom >= maskFilterRectBottom!)
        )
      ) {
        /** 扩充缓冲视口大小，最终渲染包含缓冲区域 */
        const bufferHeight = (typeof bufferSize === 'undefined' ? VirtualizedList.BUFFER_SIZE : bufferSize) * rowHeight;

        const _bufferTop = maskFilterRectTop! - bufferHeight;
        const _bufferBottom = maskFilterRectBottom! + bufferHeight;

        /** 计算可视边界距离 */
        const _offsetTop = _bufferTop > top ? _bufferTop - top : 0;
        const _offsetBottom = bottom > _bufferBottom ? bottom - _bufferBottom : 0;

        /** 计算数据截取范围 */
        const _offsetTopLen = Math.floor(_offsetTop / rowHeight);
        const _offsetBottomLen = Math.floor(_offsetBottom / rowHeight);

        offsetTop = _offsetTopLen * rowHeight;
        offsetBottom = _offsetBottomLen * rowHeight;
        showHeight = listHeight - offsetTop - offsetBottom;

        if (_offsetBottomLen === 0) {
          showData = data.slice(_offsetTopLen);
        } else {
          showData = data.slice(_offsetTopLen, -_offsetBottomLen);
        }
      }
    }

    return {
      hasRecord,
      dataLength,
      listHeight,
      showHeight,
      showData,
      offsetTop,
      offsetBottom,
    };
  };

  getRectFromRef = () => {
    let rect = { top: 0, bottom: 0 };
    if (this.listRef.current) {
      const _rect = this.state.rect;
      rect = {
        top: _rect.top,
        bottom: _rect.bottom,
      };
    }
    return rect;
  };

  render() {
    const { showRender, noRowsRender, style = {} } = this.props;
    const { hasRecord, listHeight, showHeight, showData, offsetTop, offsetBottom } = this.getStateFromProps(this.props);

    const _style: CSSProperties = {
      height: `${listHeight}px`,
      position: 'relative',
      ...style,
    };

    const _showStyle: CSSProperties = {
      position: 'absolute',
      height: `${showHeight}px`,
      top: `${offsetTop}px`,
      bottom: `${offsetBottom}px`,
      left: '0px',
      right: '0px',
    };

    return (
      <div ref={this.listRef} style={_style}>
        {!hasRecord ? noRowsRender() : <div style={_showStyle}>{showRender(showData)}</div>}
      </div>
    );
  }
}

// if (_DEV_) {
//   VirtualizedList.propTypes = {
//     /** 滤镜视口顶部 */
//     // 移到了context传递
//     maskFilterRectTop: PropTypes.number.isRequired,
//     /** 滤镜视口底部 */
//     // 移到了context传递
//     maskFilterRectBottom: PropTypes.number.isRequired,
//     /** 数据 */
//     data: PropTypes.array.isRequired,
//     /** 行高 */
//     rowHeight: PropTypes.number.isRequired,
//     /** 覆盖默认缓冲大小 */
//     bufferSize: PropTypes.number,
//     /** 展示区渲染 */
//     showRender: PropTypes.func.isRequired,
//     /** 无数据 */
//     noRowsRender: PropTypes.func.isRequired,
//   };
// }

const VirtualizedListWrapper: FC<VirtualizedListProps> = ({ ...props }) => {
  const { scrollTop, top, bottom, toggleReflow } = useContext(ScrollTopContext);

  return (
    <VirtualizedList
      {...props}
      parentToggleReflow={toggleReflow}
      maskFilterRectTop={top}
      maskFilterRectBottom={bottom}
      scrollTop={scrollTop}
    />
  );
};

export default VirtualizedListWrapper;
