/**
 * Owner: clyne@kupotech.com
 */
import React, { memo, useMemo, forwardRef } from 'react';

import { WholeLine } from './WholeLine';
import { Card } from './Card';
import { SmallCard } from './SmallCard';
import { forEach, isArray, isFunction } from 'lodash';
import TableHeader from './Header';
import Table from './Table';
import { useIsRTL } from 'src/trade4.0/hooks/common/useLang';

const VirtualizedTable = (props, ref) => {
  const {
    columns: _columns,
    needHeader,
    rowRender,
    screen,
    data,
    Footer,
    Header,
    pagination = {},
    ...rest
  } = props;

  const isRtl = useIsRTL();
  const columns = useMemo(() => {
    if (isRtl) {
      const ret = [];
      forEach(_columns, (item) => {
        const { align = 'left' } = item;
        if (isRtl) {
          if (isArray(item)) {
            const arr = [];
            forEach(item, (_item) => {
              const { align: _align = 'left' } = _item;
              arr.push({ ..._item, align: _align === 'left' ? 'right' : 'left' });
            });
            ret.push(arr);
          } else {
            ret.push({ ...item, align: align === 'left' ? 'right' : 'left' });
          }
        }
      });
      return ret;
    }
    return _columns;
  }, [_columns, isRtl]);

  const componentsProps = useMemo(() => {
    return {
      // Footer: pagination.hasMore ? (
      //   <div>
      //     <Spin size="xsmall" />
      //   </div>
      // ) : (
      //   Footer
      // ),
      Footer,
      Header: needHeader ? Header || <TableHeader columns={columns} /> : undefined,
    };
  }, [Footer, Header, columns, needHeader]);

  const defaultRowRender = (item) => {
    if (screen === 'lg2' || screen === 'lg3') {
      return <WholeLine itemData={item} columns={columns} />;
    }
    if (screen === 'lg1' || screen === 'lg') {
      return <Card itemData={item} columns={columns} />;
    }
    return <SmallCard itemData={item} columns={columns} />;
  };
  return (
    <Table
      ref={ref}
      screen={screen}
      data={data}
      useWindowScroll={false}
      componentsProps={componentsProps}
      pagination={pagination}
      RowRender={(index, item) => {
        return isFunction(rowRender) ? rowRender(item, index) : defaultRowRender(item, index);
      }}
      {...rest}
    />
  );
};

export default memo(forwardRef(VirtualizedTable));
