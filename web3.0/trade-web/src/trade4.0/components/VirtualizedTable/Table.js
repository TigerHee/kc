/**
 * Owner: clyne@kupotech.com
 */
/**
 * 基于 MInfiniteLoader 封装的H5 Card List
 * wrapperClassName
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { map, debounce } from 'lodash';
import MInfiniteLoader from './InfiniteLoader';
import { TableWrapper } from './Style.js';

const VirtualizedTable = (props, ref) => {
  const requestRef = useRef({});
  const {
    wrapperClassName,
    requestCallback,
    currentPage,
    pagination = {},
    componentsProps = {},
    ...other
  } = props;

  // 滚动事件
  const handleScroll = useCallback(
    debounce(async () => {
      if (!requestRef.current.hasRequest && pagination.hasMore) {
        requestRef.current.hasRequest = true;
        await requestCallback(pagination.currentPage + 1);
        requestRef.current.hasRequest = false;
      }
    }, 300),
    [pagination, requestCallback],
  );

  return (
    <TableWrapper>
      <MInfiniteLoader
        componentsProps={componentsProps}
        endReached={handleScroll}
        showEmpty
        ref={ref}
        isGrid={false}
        {...other}
      />
    </TableWrapper>
  );
};

export default React.memo(React.forwardRef(VirtualizedTable));
