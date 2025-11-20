/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-23 18:25:46
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/SpotlightR8Record/RecordList.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Empty, NumberFormat, Pagination, Table, useResponsive } from '@kux/mui';
import { isBoolean, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import RecordItem from './RecordItem';
import {
  EmptyWrapper,
  InfiniteScrollList,
  PaginationWrap,
  PlaceholderWrapper,
  RecordListPage,
  TokenItem,
} from './styled';

// 历史收益 记录列表接口
const RecordList = () => {
  const dispatch = useDispatch();
  const { sm, lg } = useResponsive();
  const { currentLang } = useLocale();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const campaignId = useSelector((state) => state.spotlight8.detailInfo?.campaignId);
  const recordList = useSelector((state) => state.spotlight8.recordList);
  const recordListLoading = useSelector(
    (state) => state.loading.effects['spotlight8/getRecordList'],
  );
  const { currentPage = 1, pageSize = 10, totalNum = 0, totalPage = 0, items = [] } = recordList;

  // 获取数据
  const getList = useCallback(
    ({ currentPage, pageSize }) => {
      if (campaignId) {
        dispatch({
          type: 'spotlight8/getRecordList',
          payload: {
            currentPage,
            pageSize: pageSize || 10,
            campaignId,
          },
        });
      }
    },
    [dispatch, campaignId],
  );

  useEffect(() => {
    if (isBoolean(isLogin) && isLogin) {
      getList({ currentPage: 1 });
    }
  }, [isLogin, dispatch, getList, campaignId]);

  // pc的表格配置
  const columns = useMemo(() => {
    return [
      {
        title: _t('time'),
        dataIndex: 'subTime',
        key: 'subTime',
        width: 200,
        render: (value, record) => {
          return (
            <div className="value">
              {value ? (
                <>
                  <DateTimeFormat date={value} lang={currentLang} options={{ timeZone: 'UTC' }}>
                    {value}
                  </DateTimeFormat>
                  <span className="utc">(UTC)</span>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </div>
          );
        },
      },
      {
        title: _t('volume'),
        dataIndex: 'subAmount',
        key: 'subAmount',
        width: 200,
        render: (value, record) => {
          return (
            <TokenItem>
              {record?.subAmount ? (
                <>
                  <NumberFormat lang={currentLang}>{record.subAmount}</NumberFormat>
                  <div>{record.subCurrency || ''}</div>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          );
        },
      },
      {
        title: _t('29c6fe4721894000a7c2', { currency: 'USDT' }),
        dataIndex: 'subPrice',
        key: 'subPrice',
        width: 100,
        align: 'right',
        render: (value, record) => {
          return (
            <TokenItem>
              {value ? (
                <NumberFormat lang={currentLang}>{value}</NumberFormat>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          );
        },
      },
    ];
  }, [currentLang]);
  let renderList = null;

  if (sm) {
    renderList = (
      <Table
        rowClassName="recordListRow"
        dataSource={items}
        columns={columns}
        loading={recordListLoading}
        bordered={true}
        locale={{
          emptyText: _t('678WABnThqkABxZsmacgsA'),
        }}
        pagination={
          totalPage > 1
            ? {
                current: currentPage,
                pageSize: pageSize,
                total: totalNum,
                onChange(_, newPage, newPageSize) {
                  getList({ currentPage: newPage });
                },
              }
            : false
        }
      />
    );
  } else {
    const recordListItems = (
      <InfiniteScrollList id="recordList">
        {isEmpty(items) && (
          <EmptyWrapper>
            <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
          </EmptyWrapper>
        )}
        {items.map((item, index) => {
          return (
            <RecordItem
              totalNum={items?.length}
              key={'RecordItem' + item?.index}
              index={index}
              item={item}
            />
          );
        })}
        {totalPage > 1 ? (
          <PaginationWrap>
            <Pagination
              total={totalNum || 0}
              current={currentPage || 1}
              pageSize={pageSize || 10}
              onChange={(event, currentPage) => getList({ currentPage })}
            />
          </PaginationWrap>
        ) : null}
      </InfiniteScrollList>
    );
    renderList = recordListItems;
  }
  return <RecordListPage>{renderList}</RecordListPage>;
};
export default React.memo(RecordList);
