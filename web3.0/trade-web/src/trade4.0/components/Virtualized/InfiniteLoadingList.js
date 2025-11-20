/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
// import { InfiniteLoader, List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import List from 'react-virtualized/dist/es/List';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/es/CellMeasurer';

import AutoSizer from './AutoSizer';

/**
 * InfiniteLoadingList 是自适应高度、自适应行高的无限滚动列表
 */
export default class InfiniteLoadingList extends React.Component {
  constructor(props) {
    super(props);

    this.cache = new CellMeasurerCache({
      defaultHeight: 30,
      fixedWidth: true,
    });
  }
  cache = null;

  componentDidMount() {
    // fix measureCache calc row height
    setTimeout(() => {
      this.clearAll();
    }, 500);
  }

  componentDidUpdate(prevProps) {
    const { shouldUpdateMeasurer } = this.props;

    /** shouldUpdateMeasurer (prevProps, currentProps) => [indexs...] */
    const indexs = shouldUpdateMeasurer(prevProps, this.props);
    this.clearMeasureCache(indexs);
  }

  // /** 业务层需要手动对比需要更新缓存的索引 */
  clearMeasureCache = (pIndexs = []) => {
    if (pIndexs.length) {
      // for (let i = pIndexs.length - 1; i >= 0; i--) {
      //   this.cache.clear(pIndexs[i], 0);
      // }
      this.clearAll();
    }
  }

  clearAll = () => {
    this.cache.clearAll();
    if (this.listRef) {
      this.listRef.forceUpdateGrid();
    }
  };

  // Every row is loaded except for our loading indicator row.
  isRowLoaded = ({ index }) => {
    const { hasNextPage, data } = this.props;
    return !hasNextPage || index < data.length;
  };

  // Render a list item or a loading indicator.
  rowRenderer = ({ index, isScrolling, key, parent, style }) => {
    const {
      data,
      /** loading Component */
      loadingPlaceHolder,
      /** render List Row */
      renderRow,
    } = this.props;

    let content;
    if (!this.isRowLoaded({ index })) {
      content = loadingPlaceHolder;
    } else {
      content = renderRow(data[index], index);
    }

    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div
          key={key}
          style={style}
        >
          {content}
        </div>
      </CellMeasurer>
    );
  };

  setListRef = (ref) => {
    this.listRef = ref;
  };
  listRef = null;

  render() {
    const {
      /** Are there more items to load? (This information comes from the most recent API request.) */
      hasNextPage,
      /** Are we currently loading a page of items? (This may be an in-flight flag in your Redux store for example.) */
      isNextPageLoading,
      /** List of items loaded so far */
      data = [],
      /** Callback function (eg. Redux action-creator) responsible for loading the next page of items */
      loadNextPage,
      /** Callback used to render placeholder content when rowCount is 0 */
      noRowsRender,
    } = this.props;

    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const rowCount = hasNextPage
      ? data.length + 1
      : data.length;

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreRows = isNextPageLoading
      ? () => { }
      : loadNextPage;

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={rowCount}
        threshold={0}
      >
        {({ onRowsRendered, registerChild }) => {
          const listRefHook = (ref) => {
            this.setListRef(ref);
            registerChild(ref);
          };

          return (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={listRefHook}
                  onRowsRendered={onRowsRendered}
                  rowRenderer={this.rowRenderer}
                  rowCount={rowCount}
                  deferredMeasurementCache={this.cache}
                  rowHeight={this.cache.rowHeight}
                  width={width}
                  height={height}
                  noRowsRenderer={noRowsRender}
                />
              )}
            </AutoSizer>
          );
        }}
      </InfiniteLoader>
    );
  }
}

if (_DEV_) {
  InfiniteLoadingList.propTypes = {
    hasNextPage: PropTypes.bool.isRequired,
    isNextPageLoading: PropTypes.bool,
    data: PropTypes.array.isRequired,
    loadNextPage: PropTypes.func.isRequired,
    loadingPlaceHolder: PropTypes.node.isRequired,
    renderRow: PropTypes.func.isRequired,
    shouldUpdateMeasurer: PropTypes.func.isRequired,
    noRowsRender: PropTypes.func,
  };
}
