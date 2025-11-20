/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import List from './List';
import AutoSizer from './AutoSizer';

/**
 * StaticRowHeightList 是自适应高度、固定行高的滚动列表
 */
export default class StaticRowHeightList extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.clear();
    }
  }

  clear = () => {
    if (this.listRef) {
      this.listRef.forceUpdateGrid();
    }
  };

  // Render a list item or a loading indicator.
  rowRenderer = ({ index, isScrolling, key, parent, style }) => {
    const {
      data,
      /** render List Row */
      renderRow,
    } = this.props;

    const content = renderRow(data[index], index);

    return (
      <div
        key={key}
        style={style}
      >
        {content}
      </div>
    );
  };

  setListRef = (ref) => {
    this.listRef = ref;
  };
  listRef = null;

  render() {
    const {
      /** static rowHeight */
      rowHeight,
      /** List of items loaded so far */
      data = [],
      /** Callback used to render placeholder content when rowCount is 0 */
      noRowsRender,
      scrollToIndex,
      scrollToAlignment,
    } = this.props;

    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const rowCount = data.length;

    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={this.setListRef}
            rowRenderer={this.rowRenderer}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={width}
            height={height}
            noRowsRenderer={noRowsRender}
            scrollToIndex={scrollToIndex}
            scrollToAlignment={scrollToAlignment}
          />
        )}
      </AutoSizer>
    );
  }
}

if (_DEV_) {
  StaticRowHeightList.propTypes = {
    rowHeight: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    noRowsRender: PropTypes.func,
    scrollToIndex: PropTypes.number,
    scrollToAlignment: PropTypes.string,
  };
}
