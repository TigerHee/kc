/**
 * Owner: roger@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { Spin, Empty, styled } from '@kux/mui';

import { useLang } from '../../../hookTool';
import MarketRow from './Row';
import { VirtualizedMaskFilter, VirtualizedList } from '../../VirtualizedFixList';

const ListWrapper = styled.div`
  width: 100%;
  min-width: ${(props) => (props.width ? `${props.width}px` : '268px')};
  flex: 1;
  overflow: hidden;
  & > div {
    &::-webkit-scrollbar {
      background: transparent;
      width: 4px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 8px;
      background: ${(props) => props.theme.colors.cover8};
    }
  }
`;
const EmptyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-width: ${(props) => (props.width ? `${props.width}px` : '268px')};
  flex: 1;
  overflow: hidden;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  .KuxSpin-root {
    align-self: auto;
  }
`;

const VirtualizedMaskFilterHook = styled(VirtualizedMaskFilter.RectBindHook)`
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }
`;

const List = (props) => {
  const { dataSource, width, loading, ...others } = props;
  const { t } = useLang();

  const showRender = (showData) => {
    return (
      <>
        {map(showData, (data, index) => {
          return (
            <MarketRow
              record={data}
              icon={data?.imgUrl}
              key={`${data.baseCurrency}_${data.quoteCurrency}_${data.symbol}`}
              sort={index}
              {...others}
            />
          );
        })}
      </>
    );
  };
  const noRowsRender = () => null;
  if (loading) {
    return (
      <EmptyWrapper width={width}>
        <Spin type="normal" size="small" />
      </EmptyWrapper>
    );
  }
  if (!dataSource || dataSource.length === 0) {
    return <Empty description={t('vFzzhYEWzn2Fz9YfHR4P2H')} size="small" />;
  }
  return (
    <ListWrapper width={width}>
      <VirtualizedMaskFilter>
        <VirtualizedMaskFilterHook>
          <VirtualizedList
            data={dataSource}
            rowHeight={50}
            bufferSize={5}
            showRender={showRender}
            noRowsRender={noRowsRender}
          />
        </VirtualizedMaskFilterHook>
      </VirtualizedMaskFilter>
    </ListWrapper>
  );
};

export default List;
