/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 20:48:11
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-25 16:29:27
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/EarningsRecordList/index.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Empty, Pagination, Select, Table, useResponsive } from '@kux/mui';
import clxs from 'classnames';
import { isBoolean, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import keysEquality from 'src/tools/keysEquality';
import {
  EarningsRecordListPage,
  EmptyWrapper,
  GreyToken,
  InfiniteScrollList,
  PaginationWrap,
  SelectWrapper,
  TokenItem,
} from '../styled';
import EarningsRecordItem from './EarningsRecordItem';

// 历史收益 记录列表接口
const EarningsRecordList = () => {
  const dispatch = useDispatch();
  const { sm, lg } = useResponsive();
  const { currentLang } = useLocale();
  const { isLogin } = useSelector((state) => state.user, keysEquality(['isLogin']));
  const earnTokenList = useSelector((state) => state.gempool.earnTokenList, shallowEqual);
  const [dateTime, setDateTime] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
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
  const { earningsRecordList = [] } = useSelector(
    (state) => state.gempool,
    keysEquality(['earningsRecordList']),
  );
  const earningsRecordListLoading = useSelector(
    (state) => state.loading.effects['gempool/pullEarningsRecordList'],
  );
  const {
    currentPage = 1,
    pageSize = 10,
    totalNum = 0,
    totalPage = 0,
    items = [],
  } = earningsRecordList;

  // 获取数据
  const getList = useCallback(
    ({ currentPage, pageSize }) => {
      dispatch({
        type: 'gempool/pullEarningsRecordList',
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

  // pc的表格配置
  const columns = useMemo(() => {
    return [
      {
        title: _t('time'),
        dataIndex: 'time',
        key: 'time',
        width: 200,
        render: (value, record) => {
          return (
            <div className="value">
              {value ? (
                <DateTimeFormat date={value} lang={currentLang} options={{ timeZone: 'UTC' }}>
                  {value}
                </DateTimeFormat>
              ) : (
                '--'
              )}
              <span className="unit"> (UTC)</span>
            </div>
          );
        },
      },
      {
        title: _t('a8b025402e9b4000a485'),
        dataIndex: 'token',
        key: 'token',
        width: 200,
        render: (value, record) => {
          //const _value = value ? value : record?.signUpTime;
          //const _time = moment(_value).utcOffset(0).valueOf();
          return <span>{value}</span>;
        },
      },
      {
        title: _t('40ada7ea092a4000a498'),
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (value, record) => {
          if (value === 0) {
            return _t('69d9d42cfc5c4000a212');
          } else if (value === 1) {
            return _t('3996ca5d64954000aa28');
          }
        },
      },
      {
        title: _t('cae0cb1c39254000aa73'),
        dataIndex: 'amount',
        key: 'amount',
        width: 100,
        fixed: 'right',
        align: 'right',
        render: (value, record) => {
          return (
            <TokenItem right>
              <div>{value}</div>
              <GreyToken>{record.token}</GreyToken>
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
        rowClassName="earningsRecordListRow"
        dataSource={items}
        columns={columns}
        loading={earningsRecordListLoading}
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
    const earningsRecordListItems = (
      <InfiniteScrollList id="earningsRecordList">
        {isEmpty(items) && (
          <EmptyWrapper>
            <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
          </EmptyWrapper>
        )}
        {items.map((item, index) => {
          return (
            <EarningsRecordItem
              totalNum={earningsRecordList?.length}
              key={'EarningsRecordItem' + item?.index}
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
    renderList = earningsRecordListItems;
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
      <EarningsRecordListPage>{renderList}</EarningsRecordListPage>
    </>
  );
};
export default React.memo(EarningsRecordList);
