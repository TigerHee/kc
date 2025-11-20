/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import raf from 'raf';
import PropTypes from 'prop-types';

const _hasRecord = data => data && data.length > 0;

export default class VirtualizedList extends React.Component {

  /** 缓冲部分大小 */
  static BUFFER_SIZE = 3;

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      const prevHas = _hasRecord(prevProps.data);
      const currHas = _hasRecord(this.props.data);

      // 从无到有时，触发重新渲染，获取ref重新计算
      if (!prevHas && currHas) {
        this.rerender();
      }
    }
  }

  rerender = () => {
    raf(() => {
      this.setState({});
    });
  };

  getStateFromProps = (props) => {
    const {
      rowHeight,
      data,
      maskFilterRectTop,
      maskFilterRectBottom,
      bufferSize,
    } = props;

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
      if (!((top <= maskFilterRectTop && bottom <= maskFilterRectTop) ||
        (top >= maskFilterRectBottom && bottom >= maskFilterRectBottom)
      )) {
        /** 扩充缓冲视口大小，最终渲染包含缓冲区域 */
        const bufferHeight = (typeof bufferSize === 'undefined' ?
          VirtualizedList.BUFFER_SIZE :
          bufferSize) * rowHeight;

        const _bufferTop = maskFilterRectTop - bufferHeight;
        const _bufferBottom = maskFilterRectBottom + bufferHeight;

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
    if (this.ref) {
      const _rect = this.ref.getBoundingClientRect();
      rect = {
        top: _rect.top,
        bottom: _rect.bottom,
      };
    }
    return rect;
  };

  storeRef = (ref) => {
    this.ref = ref;
  };
  ref = null;

  render() {
    const { showRender, noRowsRender, style = {} } = this.props;
    const {
      hasRecord,
      listHeight,
      showHeight,
      showData,
      offsetTop,
      offsetBottom,
    } = this.getStateFromProps(this.props);

    if (!hasRecord) {
      return noRowsRender();
    }

    const _style = {
      height: `${listHeight}px`,
      position: 'relative',
      ...style,
    };

    const _showStyle = {
      position: 'absolute',
      height: `${showHeight}px`,
      top: `${offsetTop}px`,
      bottom: `${offsetBottom}px`,
      left: '0px',
      right: '0px',
    };

    return (
      <div ref={this.storeRef} style={_style}>
        <div style={_showStyle}>
          {showRender(showData)}
        </div>
      </div>
    );
  }
}

if (_DEV_) {
  VirtualizedList.propTypes = {
    /** 滤镜视口顶部 */
    maskFilterRectTop: PropTypes.number.isRequired,
    /** 滤镜视口底部 */
    maskFilterRectBottom: PropTypes.number.isRequired,
    /** 数据 */
    data: PropTypes.array.isRequired,
    /** 行高 */
    rowHeight: PropTypes.number.isRequired,
    /** 覆盖默认缓冲大小 */
    bufferSize: PropTypes.number,
    /** 展示区渲染 */
    showRender: PropTypes.func.isRequired,
    /** 无数据 */
    noRowsRender: PropTypes.func.isRequired,
  };
}
