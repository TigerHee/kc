/**
 * Owner: charles.yang@kupotech.com
 */
import { map } from 'lodash';
import React from 'react';
import { WholeLineItem, WholeLineItemWrapper } from './Style.js';

export const WholeLine = (props) => {
  const { itemData, columns } = props;
  const trClass = [];
  const List = (
    <>
      {map(columns, (column, index) => {
        // width 最好是带单位的
        const { width, align = 'left', trClassName } = column || {};
        let style = { flex: 1, textAlign: align };
        if (trClassName) {
          const retClass = trClassName(itemData);
          if (retClass) {
            trClass.push(retClass);
          }
        }

        if (width) {
          style = { width, textAlign: align };
        }
        return (
          <WholeLineItem
            className="table-content-td"
            key={`${column.dataIndex}_${index}`}
            style={style}
          >
            {column.render
              ? column.render(itemData?.[column.dataIndex], itemData)
              : itemData?.[column.dataIndex] || '-'}
          </WholeLineItem>
        );
      })}
    </>
  );
  return (
    <WholeLineItemWrapper className={`table-content-tr ${trClass.join(' ')}`}>
      {List}
    </WholeLineItemWrapper>
  );
};

export default React.memo(WholeLine);
