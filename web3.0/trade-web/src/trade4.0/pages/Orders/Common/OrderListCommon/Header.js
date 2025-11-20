/**
 * Owner: jessie@kupotech.com
 */
import React from 'react';
import { isArray } from 'lodash';
import { HeaderColumnTitleWrap, OrderListHeader } from './style';

const Header = (props) => {
  const { columns = [], rowPercentage, screen, namespace } = props;
  return (
    <OrderListHeader
      className={
        screen === 'lg1' || (screen === 'lg2' && namespace === 'orderHistory') ? 'special' : ''
      }
    >
      {columns.map((c, i) => {
        if (isArray(c)) {
          return null;
        }
        const styleObj = {};
        styleObj.width = `${rowPercentage[i] * 100}%`;
        const isMergeColumn = c.key.indexOf('_') > -1;
        const content = (
          <div
            key={`${c.key}-header`}
            style={styleObj}
            className={isMergeColumn ? 'mergeColumn' : ''}
          >
            {c.isSelect || c.dataIndex === 'operator' ? (
              c.title
            ) : (
              <HeaderColumnTitleWrap>{c.title}</HeaderColumnTitleWrap>
            )}
          </div>
        );
        return content;
      })}
    </OrderListHeader>
  );
};

export default Header;
