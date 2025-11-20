/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-20 21:00:01
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/EarningsSummaryList/index.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Empty, Pagination, Select, Table, useResponsive } from '@kux/mui';
import clxs from 'classnames';
import { isBoolean, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import {
  EarningsSummaryListPage,
  EmptyWrapper,
  GreyToken,
  InfiniteScrollList,
  PaginationWrap,
  PrizePoolItem,
  SelectWrapper,
  TokenItem,
} from '../styled';
import EarningsSummaryItem from './EarningsSummaryItem';

// 历史收益的汇总
const EarningsSummaryList = () => {
  const dispatch = useDispatch();
  const { sm, lg } = useResponsive();
  const { currentLang } = useLocale();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const earnTokenList = useSelector((state) => state.gempool.earnTokenList, shallowEqual);
  const [dateTime, setDateTime] = useState('');
  const [selectedToken, setSelectedToken] = useState('');

  const { earningsSummaryList = [] } = useSelector(
    (state) => state.gempool,
    keysEquality(['earningsSummaryList']),
  );
  const earningsSummaryListLoading = useSelector(
    (state) => state.loading.effects['gempool/pullEarningsSummaryList'],
  );
  const {
    currentPage = 1,
    pageSize = 10,
    totalNum = 0,
    totalPage = 0,
    items = [],
  } = earningsSummaryList;

  // 获取数据
  const getList = useCallback(
    ({ currentPage, pageSize }) => {
      dispatch({
        type: 'gempool/pullEarningsSummaryList',
        payload: {
          currentPage,
          pageSize: pageSize || 10,
          dateTime,
          earnToken: selectedToken,
        },
      });
    },
    [dispatch, dateTime, selectedToken],
  );

  useEffect(() => {
    if (isBoolean(isLogin) && isLogin) {
      getList({ currentPage: 1 });
    }
  }, [isLogin, dispatch, getList]);

  useEffect(() => {
    dispatch({
      type: 'gempool/pullGemPoolEarnTokenList',
    });
  }, [dispatch]);

  const convertTokenList = useMemo(() => {
    if (!Array.isArray(earnTokenList)) {
      return [];
    }
    const result = earnTokenList.map((item) => ({ label: item, value: item }));
    result.splice(0, 0, { label: _t('all'), value: 'all' });
    return result;
  }, [earnTokenList]);

  // pc的表格配置
  const columns = useMemo(() => {
    return [
      {
        title: _t('a8b025402e9b4000a485'),
        dataIndex: 'earnToken',
        key: 'earnToken',
        width: 200,
        render: (value, record) => (
          <TokenItem>
            <img src={record.earnTokenLogo} alt="logo" />
            <div>{value}</div>
          </TokenItem>
        ),
      },
      {
        title: _t('39365b4fd91c4000a817'),
        dataIndex: 'poolSummary',
        key: 'poolSummaryPool',
        width: 200,
        render: (value, record) => {
          return (
            <PrizePoolItem>
              {value?.length > 0 &&
                value.map((item, index) => {
                  return (
                    <TokenItem key={`poolSummaryPool+${index}`}>
                      <img src={item.stakingTokenLogo} alt="logo" />
                      <div>{item.stakingToken}</div>
                    </TokenItem>
                  );
                })}
            </PrizePoolItem>
          );
        },
      },
      {
        title: _t('cae0cb1c39254000aa73'),
        dataIndex: 'poolSummary',
        key: 'poolSummaryIncome',
        width: 100,
        render: (value, record) => {
          return (
            <PrizePoolItem>
              {value?.length > 0 &&
                value.map((item, index) => {
                  return (
                    <TokenItem key={`poolSummaryIncome+${index}`}>
                      <div>{item.poolRewardAmount}</div>
                      <GreyToken>{record.earnToken}</GreyToken>
                    </TokenItem>
                  );
                })}
            </PrizePoolItem>
          );
        },
      },
      {
        title: _t('21b13e03245c4000a597'),
        dataIndex: 'totalRewardAmount',
        key: 'totalRewardAmount',
        width: 100,
        fixed: 'right',
        align: 'right',
        render: (value, record) => {
          return (
            <TokenItem right>
              <div>{value}</div>
              <GreyToken>{record.earnToken}</GreyToken>
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
        rowClassName="earningsSummaryListRow"
        dataSource={items}
        columns={columns}
        loading={earningsSummaryListLoading}
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
    const earningsSummaryListItems = (
      <InfiniteScrollList id="earningsSummaryList">
        {isEmpty(items) && (
          <EmptyWrapper>
            <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
          </EmptyWrapper>
        )}
        {items.map((item, index) => {
          return (
            <EarningsSummaryItem
              totalNum={items?.length}
              key={'EarningsSummaryItem' + item?.id}
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
    renderList = earningsSummaryListItems;
  }
  return (
    <>
      <SelectWrapper className={clxs({ h5_SelectBox: !sm })}>
        <Select
          allowClear
          placeholder={_t('time')}
          value={dateTime}
          options={[
            { label: _t('all'), value: 'all', type: 'month' },
            { label: _t('one.month'), value: 1, type: 'month' },
            { label: _t('three.month'), value: 3, type: 'month' },
            { label: _t('six.month'), value: 6, type: 'month' },
          ]}
          onChange={setDateTime}
        />
        <Select
          allowClear
          value={selectedToken}
          onChange={setSelectedToken}
          placeholder={_t('a8b025402e9b4000a485')}
          options={convertTokenList}
        />
      </SelectWrapper>
      <EarningsSummaryListPage>{renderList}</EarningsSummaryListPage>
    </>
  );
};
export default React.memo(EarningsSummaryList);
