/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import {map} from 'lodash';

const WrapperView = styled.View`
  width: 100%;
`;
const ColumnsView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
`;
const ColumnText = styled.Text`
  flex: 1;
  font-size: 12px;
  color: rgba(0, 20, 42, 0.4);
  text-align: left;
`;
const ListView = styled.View`
  width: 100%;
  align-items: center;
  padding: 0px 16px 6px;
`;
const ListItemView = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
`;
const ListItemText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: rgba(0, 20, 42, 0.4);
`;
const EmptyView = styled.View`
  width: 100%;
  height: 220px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const EmptyImg = styled.Image`
  width: 100px;
  height: 100px;
`;
const Table = props => {
  const {columns, dataSource} = props;
  return (
    <WrapperView>
      <ColumnsView>
        {map(columns, item => {
          const {text, key, text_align} = item || {};
          return (
            <ColumnText key={key} style={{textAlign: text_align}}>
              {text}
            </ColumnText>
          );
        })}
      </ColumnsView>
      {!dataSource || !dataSource.length ? (
        <EmptyView>
          <EmptyImg source={require('assets/gembox/Empty.png')} />
        </EmptyView>
      ) : (
        <ListView>
          {map(dataSource, (sourceItem, index) => {
            return (
              <ListItemView key={index}>
                {map(columns, (item, i) => {
                  const {key, text_align, render} = item || {};
                  return (
                    <ListItemText style={{textAlign: text_align}} key={i}>
                      {render ? render(sourceItem[key], item) : sourceItem[key]}
                    </ListItemText>
                  );
                })}
              </ListItemView>
            );
          })}
        </ListView>
      )}
    </WrapperView>
  );
};
export default Table;
