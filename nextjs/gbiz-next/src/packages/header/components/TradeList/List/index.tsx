/**
 * Owner: roger@kupotech.com
 */
import React, { FC, useRef } from 'react';
import { Loading, Empty } from '@kux/design';
import { useTranslation } from 'tools/i18n';
import MarketRow, { type MarketRowProps } from './Row';
import { VirtualizedMaskFilter } from '../../VirtualizedFixList';
import styles from './styles.module.scss';
import { getSearchMinHeight, MIN_HEIGHT } from '../utils';
import InfiniteLoadingList from 'packages/notice-center/components/Virtualized/InfiniteLoadingList'

// @ts-ignore
const RectBindHook = VirtualizedMaskFilter.RectBindHook;

interface ListProps extends Omit<MarketRowProps, 'record' | 'icon' | 'key' | 'sort'> {
  dataSource: any;
  width: number;
  loading: boolean;
  visible?: boolean;
}

const List: FC<ListProps> = props => {
  const { dataSource, width, loading, ...others } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('header');
  const visible = props.visible;
  const hasData = dataSource?.length > 0;

  // 设置搜索列表的高度
  let height = MIN_HEIGHT;
  if (hasData && visible) {
    height = Math.max(MIN_HEIGHT, getSearchMinHeight(ref));
  }

  const showRender = (data, index) => {
    return (
      <MarketRow
        record={data}
        icon={data?.imgUrl}
        key={`${data.baseCurrency}_${data.quoteCurrency}_${data.symbol}`}
        sort={index}
        {...others}
      />
    );
  };

  const noRowsRender = () => null;
  if (loading) {
    return (
      <div className={styles.emptyWrapper} style={{ minWidth: width, height }}>
        <Loading className={styles.listLoading} type="brand" size="medium" />
      </div>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <Empty
        className={styles.emptyPlaceholder}
        description={t('vFzzhYEWzn2Fz9YfHR4P2H')}
        size="small"
        name="no-record"
      />
    );
  }

  return (
    // <div className={styles.listWrapper} style={{ minWidth: width }}>
    <div ref={ref} className={styles.listWrapper}>
      <InfiniteLoadingList
          hasNextPage={false}
          isNextPageLoading={false}
          data={dataSource}
          loadNextPage={()=> {}}
          renderRow={showRender}
          shouldUpdateMeasurer={() => []}
          noRowsRender={noRowsRender}
          loadingPlaceHolder={null}
        />
    </div>
  );
};

export default List;
