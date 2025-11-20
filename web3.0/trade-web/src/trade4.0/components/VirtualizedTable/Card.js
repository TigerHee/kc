/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { map, isFunction } from 'lodash';
import { styled, fx } from '@/style/emotion';

const CardContent = styled.div`
  ${fx.padding('0px 12px 12px 12px')}
`;

const CardRow = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('top')}
  ${fx.paddingTop('12')}
`;

const CardItem = styled.div`
  ${fx.flexShrink('0')}
  ${fx.flex('auto')}
`;

const CardItemTitle = styled.div`
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  ${fx.marginBottom(6)}
  ${(props) => fx.color(props, 'text40')}
`;

const CardItemValue = styled.div`
  ${fx.fontWeight(400)}
  ${fx.fontSize(12)}
  ${fx.lineHeight(16)}
  ${(props) => fx.color(props, 'text60')}
`;

export const Card = (props) => {
  const { itemData, columns } = props;
  return (
    <CardContent className="card-content">
      {map(columns, (item, index) => {
        const trIndex = item[0]?.dataIndex;
        return (
          <CardRow key={trIndex} className={`card-tr ${trIndex}`}>
            {map(item, (column) => {
              // width 最好是带单位的
              const { width, align = 'left', flex = 1 } = column || {};
              const style = { flex, align };
              return (
                <CardItem
                  key={`${column.dataIndex}_${index}`}
                  style={style}
                  className={`card-items ${column.dataIndex}`}
                >
                  {column.noTitle ? null : (
                    <CardItemTitle className="card-title">
                      {isFunction(column.title) ? column.title() : column.title}
                    </CardItemTitle>
                  )}
                  <CardItemValue className="card-value">
                    {column.render
                      ? column.render(itemData?.[column.dataIndex], itemData)
                      : itemData?.[column.dataIndex] || '-'}
                  </CardItemValue>
                </CardItem>
              );
            })}
          </CardRow>
        );
      })}
    </CardContent>
  );
};

export default memo(Card);
