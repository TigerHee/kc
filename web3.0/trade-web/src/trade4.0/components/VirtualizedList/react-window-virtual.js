/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-16 15:16:06
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-05-26 16:13:47
 * @FilePath: /trade-web/src/trade4.0/components/VirtualizedList/react-window-virtual.js
 * @Description: render的item比较复杂，react-virtualized滚动会有性能问题，这个组件引用性能更好的react-window
 */
import React from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const VirtualizedList = ({ props, itemCount, itemHeight, direction, render }) => {
  return (
    <AutoSizer>
      {({ width, height }) => (
        <FixedSizeList
          direction={direction}
          itemData={props}
          itemCount={itemCount}
          itemSize={itemHeight}
          width={width}
          height={height}
        >
          {render}
        </FixedSizeList>
      )}
    </AutoSizer>
  );
};
export default React.memo(VirtualizedList);
