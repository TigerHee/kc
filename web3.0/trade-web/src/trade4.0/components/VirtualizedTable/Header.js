/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { map, isFunction } from 'lodash';
import { HeaderWrapper, HeaderItem } from './Style.js';

const TableHeader = (props) => {
  const { columns = [] } = props;
  return (
    <HeaderWrapper className="table-header-tr">
      {map(columns, (column) => {
        // width 最好是带单位的
        const { width, align = 'left' } = column || {};
        let style = { flex: 1, textAlign: align };
        if (width) {
          style = { width, textAlign: align };
        }
        return (
          <HeaderItem className="table-header-th" key={`${column.dataIndex}_header`} style={style}>
            {isFunction(column.title) ? column.title() : column.title}
          </HeaderItem>
        );
      })}
    </HeaderWrapper>
  );
};

export default memo(TableHeader);
