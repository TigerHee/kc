/**
 * owner: larvide.peng@kupotech.com
 */
import { Spin, useMediaQuery } from '@kux/mui';
import { memo, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import MuiButton from 'routes/SlothubPage/components/mui/Button';
import RocketIco from 'static/slothub/rocket-ico.svg';
import { _t } from 'tools/i18n';
import { ItemType } from '../constants';
import {
  HistoryExchangeRecordListItem,
  HistoryRecordListExpriedItem,
  HistoryRecordListInviteRecordItem,
  HistoryRecordListItem,
} from './ListItem';
import {
  DividerWrapper,
  EmptyFill,
  EmptyWrapper,
  HistoryRecordListFooter,
  HistoryRecordListWrapper,
  SpinStyled,
  StyledEmpty,
} from './styled';

const ScrollList = ({
  pagination,
  listType,
  list,
  loading,
  loadMoreItems,
  initialing,
  closeDialog,
}) => {
  const sm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const hasMore = useMemo(
    () => !loading && pagination.currentPage < pagination.totalPage,
    [loading, pagination.currentPage, pagination.totalPage],
  );

  const RenderItem = ({ index }) => {
    const item = list[index];
    switch (listType) {
      case ItemType.expried:
        return <HistoryRecordListExpriedItem item={item} />;
      case ItemType.inviteRecord:
        return <HistoryRecordListInviteRecordItem type={listType} item={item} />;
      case ItemType.expenditure:
        return <HistoryExchangeRecordListItem type={listType} item={item} />;
      default:
        return <HistoryRecordListItem type={listType} item={item} />;
    }
  };

  if (initialing) return <SpinStyled size="small" isListEmpty={initialing} spinning type="brand" />;
  if (list.length === 0)
    return (
      <EmptyWrapper>
        <StyledEmpty name="no-record" size="small" description={_t('4654a8d762194000a513')} />
        {(listType === ItemType.income || listType === ItemType.expenditure) && (
          <MuiButton
            fullWidth={sm}
            style={{ maxWidth: 311, margin: 0 }}
            startIcon={<img src={RocketIco} alt="rocket" className="horizontal-flip-in-arabic" />}
            ml={12}
            onClick={closeDialog}
          >
            {_t('46e9e3d6026a4000ab3c')}
          </MuiButton>
        )}
        {listType === ItemType.expried && <EmptyFill />}
      </EmptyWrapper>
    );

  return (
    <HistoryRecordListWrapper>
      <InfiniteScroll
        pageStart={1}
        initialLoad={true}
        loadMore={loadMoreItems}
        hasMore={hasMore}
        useWindow={false}
      >
        {list.map((item, index) => {
          return <RenderItem key={`item-${index}`} index={index} item={item} />;
        })}
        {!hasMore && !loading && !hasMore && (
          <HistoryRecordListFooter key={'footer'}>
            <DividerWrapper>{_t('4654a8d762194000a513')}</DividerWrapper>
          </HistoryRecordListFooter>
        )}
        {hasMore && loading && (
          <HistoryRecordListFooter key="loading">
            <Spin spinning type="brand" size="small" />
          </HistoryRecordListFooter>
        )}
      </InfiniteScroll>
    </HistoryRecordListWrapper>
  );
};

export default memo(ScrollList);
