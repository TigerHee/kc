/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { map, isFunction } from 'lodash';
import { styled, fx } from '@/style/emotion';

const CardContent = styled.div`
  ${fx.padding('12px')}
`;

const CardItem = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.justifyContent('space-between')}
  ${fx.marginBottom(10)}
  &:last-child {
    ${fx.marginBottom(0)}
  }
`;

const CardItemTitle = styled.div`
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  ${(props) => fx.color(props, 'text40')}
`;

const CardItemValue = styled.div`
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  ${(props) => fx.color(props, 'text60')}
  width: ${(props) => (props.noTitle ? '100%' : '')};
`;

export const SmallCard = (props) => {
  const { itemData, columns } = props;
  return (
    <CardContent className="card-xs-tr">
      {map(columns, (column, index) => {
        return (
          <CardItem key={`${column.dataIndex}_${index}`} className="card-items-sm">
            {column.noTitle ? null : (
              <CardItemTitle className="card-title-sm">
                {isFunction(column.title) ? column.title() : column.title}
              </CardItemTitle>
            )}
            <CardItemValue noTitle={column.noTitle} className="card-value-sm">
              {column.render
                ? column.render(itemData?.[column.dataIndex], itemData)
                : itemData?.[column.dataIndex] || '-'}
            </CardItemValue>
          </CardItem>
        );
      })}
    </CardContent>
  );
};

export default memo(SmallCard);
