/**
 * Owner: borden@kupotech.com
 */
import React, { forwardRef } from 'react';
import { List, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';
import { useIsRTL } from '@/hooks/common/useLang';

const VirtualizedList = forwardRef(
  (
    {
      autoHeight = false,
      length,
      render,
      itemHeight = 44,
      // 这个字段主要用来复写有个列表倒着显示的需求（卖盘高度不足的时候需要贴着bar显示）
      notfilledClass = '',
    },
    ref,
  ) => {
    const isRTL = useIsRTL();
    return (
      <AutoSizer>
        {({ width, height }) => {
          const isNotFill = length * itemHeight < height;
          return (
            <List
              className={isNotFill ? notfilledClass : ''}
              ref={ref}
              autoHeight={autoHeight}
              width={width}
              height={height}
              rowCount={length}
              rowHeight={itemHeight}
              rowRenderer={({ style, index }) => {
                // AR适配
                const sty = isRTL ? { ...style, direction: 'rtl' } : style;
                return render({ style: sty, index });
              }}
              overscanRowCount={Math.floor(height / itemHeight)}
            />
          );
        }}
      </AutoSizer>
    );
  },
);
export default VirtualizedList;
