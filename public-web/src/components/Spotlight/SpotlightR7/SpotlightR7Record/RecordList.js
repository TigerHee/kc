/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-23 18:25:46
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR7/SpotlightR7Record/RecordList.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Empty, NumberFormat, Pagination, Table, useResponsive, dateTimeFormat } from '@kux/mui';
import { isBoolean, isEmpty } from 'lodash';
import { isNil } from 'lodash-es';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import RecordItem from './RecordItem';
import {
  Color,
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
  const campaignId = useSelector((state) => state.spotlight7.detailInfo?.campaignId);
  const recordList = useSelector((state) => state.spotlight7.recordList);
  const recordListLoading = useSelector(
    (state) => state.loading.effects['spotlight7/getRecordList'],
  );
  const { currentPage = 1, pageSize = 10, totalNum = 0, totalPage = 0, items = [] } = recordList;

  // 获取数据
  const getList = useCallback(
    ({ currentPage, pageSize }) => {
      if (campaignId) {
        dispatch({
          type: 'spotlight7/getRecordList',
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
                  {dateTimeFormat({
                    date: value,
                    lang: currentLang,
                    options: { timeZone: 'UTC' },
                  })}
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </div>
          );
        },
      },
      {
        title: _t('a487981ce8294000ab2e', { currency: 'USDT' }),
        dataIndex: 'subAmount',
        key: 'subAmount',
        width: 200,
        render: (value, record) => {
          return (
            <TokenItem>
              {record.subAmount ? (
                <>
                  <NumberFormat lang={currentLang}>{record.subAmount}</NumberFormat>
                  <div> {record.subToken}</div>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          );
        },
      },
      {
        title: _t('2282b30353614000aaf6', { currency: 'USDT' }),
        dataIndex: 'price',
        key: 'price',
        width: 100,
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
      {
        title: _t('edbdce2e23784000ac9d')+' (PUMP)',
        dataIndex: 'tokenAmount',
        key: 'tokenAmount',
        width: 100,
        render: (value, record) => {
          return (
            <TokenItem>
              {record.tokenAmount ? (
                <>
                  <NumberFormat lang={currentLang}>{record.tokenAmount}</NumberFormat>
                  <div> {record.token}</div>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          );
        },
      },
      {
        title: _t('23e1b860074a4000a43a'),
        dataIndex: 'status',
        key: 'status',
        width: 100,
        fixed: 'right',
        align: 'right',
        render: (value, record) => {
          const {subSuccessRatio } = record;
          if (isNil(value)) {
            return <PlaceholderWrapper>--</PlaceholderWrapper>;
          }
          // "申购状态: 0 待分发 1 已完成 2 失败 3 部分申购成功"4 发放成功
          const STATUS_MAP = {
            0: 'aa7debf9e7fd4000af67',    // Pending distribution
            1: '349ecc4085de4000a74f',    // Completed
            2: 'failed',                  // Failed
            4: '47d024b918ff4000a307',    // Distribution successful
            3: '7c11781454174800a9e5'     // Partial success (handled specially)
          };
          if (value === 3) {
            return (
              <Color status={value}>
                {_t(STATUS_MAP[3], { num: subSuccessRatio * 100 })}
              </Color>
            );
          }
          return (
            <Color status={value}>
              {_t(STATUS_MAP[value])}
            </Color>
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
              totalNum={recordList?.length}
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
