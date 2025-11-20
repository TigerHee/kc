/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowDownOutlined, ICArrowUpOutlined, ICInfoOutlined } from '@kux/icons';
import { Divider, Tooltip, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { filter, map } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import asyncSocket from 'tools/asyncSocket';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';
import siteCfg from 'utils/siteConfig';
import { useResponsiveSize } from '../../hooks';
import Card from './Card';
import ChangeRate from './ChangeRate';
import ChangeTimePicker from './ChangeTimePicker';
import {
  ChangeRateWrapper,
  ColumnRow,
  CurrencyInfoLayer,
  CurrencyInfoNameLayer,
  CurrencyLayer,
  HandleListLayer,
  LabelWrapper,
  LinkTitle,
  MoreDivLayer,
  MoreText,
  NormalPriceWrapper,
  NumFormat,
  PriceTitle,
  PriceWrapper,
  TableLayer,
  TableWrapper,
  TimeWrapper,
  TradeWrap,
} from './styledComponents';

// 域名映射
const { KUCOIN_HOST, TRADE_HOST } = siteCfg;

const NewCurrencyTable = () => {
  const isInApp = JsBridge.isApp();
  const size = useResponsiveSize();
  const sorter = useSelector((state) => state.rocketZone.sorter, shallowEqual);
  const klinesMap = useSelector((state) => state.rocketZone.klinesMap, shallowEqual);
  const activeRate = useSelector((state) => state.rocketZone.activeRate);
  const loadingTable = useSelector((state) => state.loading.effects['rocketZone/pullTableList']);

  const records = useSelector((state) => state.rocketZone.records, shallowEqual);
  const dispatch = useDispatch();
  const [isMore, setIsMore] = useState();

  const { currentLang } = useLocale();
  const { sm, lg } = useResponsive();

  const symbols = useMemo(() => {
    return map(
      filter(records, (record) => record?.symbolCode),
      (item) => {
        return item.symbolCode;
      },
    )
      .sort() // 排除顺序的影响
      .join(',');
  }, [records]);

  useEffect(() => {
    dispatch({
      type: 'rocketZone/pullTableList',
    });
  }, [dispatch]);

  //socket监听行情
  useEffect(() => {
    if (!symbols) return;
    asyncSocket((socket) => {
      socket.subscribe(`/market/snapshot:${symbols}`);
    });

    return () => {
      //清除当前页的订阅
      asyncSocket((socket) => {
        socket.unsubscribe(`/market/snapshot:${symbols}`);
      });
    };
  }, [symbols]);

  const [isChangingMore, setChangingMore] = useState(false);
  const changingMoreTimerRef = useRef();
  const clearChangingMoreTimer = useCallback(() => {
    if (!changingMoreTimerRef.current) {
      return;
    }
    clearTimeout(changingMoreTimerRef.current);
    changingMoreTimerRef.current;
  }, []);

  const showMore = useCallback(() => {
    clearChangingMoreTimer();
    setChangingMore(true);
    // 防止高INP
    setTimeout(() => {
      setIsMore(!isMore);
    }, 0);
    changingMoreTimerRef.current = setTimeout(() => {
      setChangingMore(false);
      clearChangingMoreTimer();
    }, 500);
    if (isMore) {
      // 收起，移动到顶部
      const _top = document.getElementById('newCurrencyTable').offsetTop;
      window.scrollTo(0, _top || 526);
    }
    trackClick(['newlistinperformance', 'newlistMore']);
  }, [clearChangingMoreTimer, isMore]);

  const handleTableChange = useCallback(
    (paginationInfo, filters, sorterNow) => {
      dispatch({
        type: 'rocketZone/updateSorter',
        payload: sorterNow,
        override: true,
      });
    },
    [dispatch],
  );

  const handleTrade = useCallback(
    (value) => {
      if (!value) return;
      if (isInApp) {
        // app内跳转
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/trade?symbol=${value}&goBackUrl=${encodeURIComponent(window.location.href)}`,
          },
        });
      } else {
        push(`/trade/${value}`);
      }
    },
    [isInApp],
  );

  const onRowClick = useCallback(
    (record) => {
      handleTrade(record?.symbol);
    },
    [handleTrade],
  );

  const sorterFn = useCallback(
    (a, b) => {
      if (!sorter) {
        return 0;
      }
      const { columnKey, order } = sorter || {};
      if (order === 'asc') {
        return (a[columnKey] || 0) - (b[columnKey] || 0);
      }
      if (order === 'desc') {
        return (b[columnKey] || 0) - (a[columnKey] || 0);
      }
      return 0;
    },
    [sorter],
  );

  const renderCoinColumn = useCallback((value, row, isShowRate = false) => {
    const { name, changeRate24h, fullName, iconUrl, label, labelText, symbol } = row || {};
    const changeRateRender = changeRate24h ? changeRate24h : 0;
    let _class = 'redBack';
    if (label === 'yellow') {
      _class = 'yellowBack';
    } else if (label === 'green') {
      _class = 'greenBack';
    }
    return (
      <CurrencyLayer>
        <img src={iconUrl} alt={name} />
        <CurrencyInfoLayer>
          <CurrencyInfoNameLayer>
            <LinkTitle>{name}</LinkTitle>
            {isShowRate && <ChangeRate value={changeRateRender} needBg size="sssm" />}
            {labelText ? <span className={`${'tag'} ${_class}`}>{labelText}</span> : null}
          </CurrencyInfoNameLayer>
          <span>{fullName}</span>
        </CurrencyInfoLayer>
      </CurrencyLayer>
    );
  }, []);

  const commonColumns = useMemo(() => {
    return {
      name: {
        title: _t('new.currency.coin'),
        dataIndex: 'name',
        align: 'left',
        width: '160px',
        render(value, row) {
          return renderCoinColumn(value, row);
        },
      },
      allChangeRate: {
        title: (
          <>
            <LabelWrapper>
              <span style={{ paddingRight: 2 }}>{_t('new.currency.change.release')}</span>
              <Tooltip
                placement="top"
                title={
                  <p>
                    {_t('new.currency.compute')}
                    <br />
                    {_t('new.currency.compute.1')}
                  </p>
                }
              >
                <div style={{ width: '15px', height: '15px' }}>
                  <ICInfoOutlined onClick={(e) => e.stopPropagation()} size={16} />
                </div>
              </Tooltip>
            </LabelWrapper>
          </>
        ),
        dataIndex: 'allChangeRate',
        align: 'right',
        width: '160px',
        sorter: (a, b) => {
          if (!a.allChangeRate) {
            a.allChangeRate = 0;
          }
          if (!b.allChangeRate) {
            b.allChangeRate = 0;
          }
          return a.allChangeRate - b.allChangeRate;
        },

        render(value) {
          if (!value) {
            return '--';
          }
          let _class = '';
          if (value > 0) {
            _class = 'green';
          } else if (value < 0) {
            _class = 'red';
          }
          return (
            <NumFormat className={`${_class} ${'float_right_css'}`}>
              <ChangeRate value={value} />
            </NumFormat>
          );
        },
      },
      openingTime: {
        title: `${_t('new.currency.time.release')}(UTC)`,
        dataIndex: 'openingTime',
        align: 'right',
        width: '120px',
        sorter: (a, b) => a.openingTime - b.openingTime,
        render(value) {
          return value
            ? dateTimeFormat({
                lang: currentLang,
                date: value,
                options: {
                  year: 'numeric',
                  day: '2-digit',
                  month: '2-digit',
                  timeZone: 'UTC',
                  ...(size === 'md'
                    ? {
                        hour: undefined,
                        minute: undefined,
                        second: undefined,
                      }
                    : {}),
                },
              })
            : '--';
        },
      },
      operations: {
        title: _t('new.currency.operations'),
        dataIndex: 'currency',
        align: 'right',
        width: '190px',
        ...(size === 'md'
          ? {
              fixed: 'right',
            }
          : {}),
        render(value, row) {
          const {
            symbol, // 现货交易对
            tradeEnabled, // 现货交易状态
          } = row || {};
          const coinDetailUrl = addLangToPath(`${KUCOIN_HOST}/price/${value}`);
          let _trade = null;
          if (tradeEnabled) {
            _trade = (
              <TradeWrap>
                <Divider type="vertical" />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={addLangToPath(`${TRADE_HOST}/${symbol}`)}
                  onClick={() => {
                    trackClick(['newlistinperformance', 'newcoinlistTrade'], { symbol: symbol });
                  }}
                >
                  {_t('new.currency.trade')}
                </a>
              </TradeWrap>
            );
          }
          return (
            <HandleListLayer>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={coinDetailUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  trackClick(['newlistinperformance', 'newcoinlistDetails'], { symbol: symbol });
                }}
              >
                {_t('new.currency.detail')}
              </a>
              {_trade}
            </HandleListLayer>
          );
        },
      },
    };
  }, [currentLang, renderCoinColumn, size]);

  const genSmColumns = useCallback(() => {
    return [
      {
        title: (
          <span style={{ paddingRight: 2, whiteSpace: 'nowrap' }}>
            {_t('new.currency.coin')}/{_t('market.all.crypto.rowkey.change')}
          </span>
        ),
        dataIndex: 'lastTradedPrice',
        align: 'left',
        sorter: (a, b) => {
          const currentA = a?.changeRate24h || 0;
          const currentB = b?.changeRate24h || 0;
          return currentA - currentB;
        },
        render(value, row) {
          return renderCoinColumn(value, row, true);
        },
      },
      {
        title: _t('new.currency.price'),
        dataIndex: 'lastTradedPrice',
        align: 'right',
        sorter: null,
        width: '100px',
        render(value, row) {
          const { quoteCurrency, currency } = row || {};
          return (
            <PriceWrapper>
              <NormalPriceWrapper
                quoteCurrency={quoteCurrency}
                value={value}
                baseCurrency={currency}
              />
            </PriceWrapper>
          );
        },
      },
      {
        title: <span style={{ paddingRight: 2 }}>{_t('new.currency.change.release')}</span>,
        dataIndex: 'allChangeRate',
        align: 'right',
        sorter: (a, b) => {
          if (!a.allChangeRate) {
            a.allChangeRate = 0;
          }
          if (!b.allChangeRate) {
            b.allChangeRate = 0;
          }
          return a.allChangeRate - b.allChangeRate;
        },

        render(value, row) {
          const { openingTime } = row || {};
          let _class = '';
          if (value > 0) {
            _class = 'green';
          } else if (value < 0) {
            _class = 'red';
          }
          return (
            <>
              <ChangeRateWrapper>{value ? <ChangeRate value={value} /> : '--'}</ChangeRateWrapper>
              <TimeWrapper>
                {openingTime
                  ? dateTimeFormat({
                      lang: currentLang,
                      date: openingTime,
                      options: {
                        year: 'numeric',
                        day: '2-digit',
                        month: '2-digit',
                        timeZone: 'UTC',
                        hour: undefined,
                        minute: undefined,
                        second: undefined,
                      },
                    })
                  : '--'}
              </TimeWrapper>
            </>
          );
        },
      },
    ];
  }, [currentLang, renderCoinColumn]);

  const genMdColumns = useCallback(() => {
    return [
      commonColumns.name,
      {
        title: (
          <PriceTitle>
            <span>{_t('new.currency.price')}</span>
            <ChangeTimePicker activeRate={activeRate} nameSpace="rocketZone" />
          </PriceTitle>
        ),
        dataIndex: 'lastTradedPrice',
        align: 'right',
        width: '180px',
        sorter: (a, b) => {
          const currentA = a?.changeRate24h || 0;
          const currentB = b?.changeRate24h || 0;
          return currentA - currentB;
        },
        render(value, row) {
          const { quoteCurrency, changeRate24h, currency } = row || {};
          const changeRateArray = [row?.changeRate1h, row?.changeRate4h, row?.changeRate24h];
          const changeRateRender = changeRateArray[activeRate] ? changeRateArray[activeRate] : 0;
          return (
            <PriceWrapper>
              <NormalPriceWrapper
                quoteCurrency={quoteCurrency}
                value={value}
                baseCurrency={currency}
              />
              <ChangeRate value={changeRateRender} isShowArrawIcon />
            </PriceWrapper>
          );
        },
      },
      commonColumns.allChangeRate,
      commonColumns.openingTime,
      commonColumns.operations,
    ];
  }, [
    activeRate,
    commonColumns.allChangeRate,
    commonColumns.name,
    commonColumns.openingTime,
    commonColumns.operations,
  ]);

  const genLgColumns = useCallback(() => {
    return [
      commonColumns.name,
      {
        title: _t('new.currency.price'),
        dataIndex: 'lastTradedPrice',
        align: 'right',
        sorter: null,
        render(value, row) {
          const { quoteCurrency, currency } = row || {};

          return (
            <PriceWrapper>
              <NormalPriceWrapper
                quoteCurrency={quoteCurrency}
                value={value}
                baseCurrency={currency}
              />
            </PriceWrapper>
          );
        },
      },
      {
        title: <ChangeTimePicker activeRate={activeRate} nameSpace="rocketZone" />,
        sorter: (a, b) => {
          const changeRateArrayA = [a?.changeRate1h, a?.changeRate4h, a?.changeRate24h];
          const changeRateArrayB = [b?.changeRate1h, b?.changeRate4h, b?.changeRate24h];
          const currentA = changeRateArrayA[activeRate] || 0;
          const currentB = changeRateArrayB[activeRate] || 0;
          return currentA - currentB;
        },
        dataIndex: 'changeRate',
        align: 'right',
        render: (changeRate, record) => {
          const changeRateArray = [
            record?.changeRate1h,
            record?.changeRate4h,
            record?.changeRate24h,
          ];
          const changeRateRender = changeRateArray[activeRate] ? changeRateArray[activeRate] : 0;
          return (
            <ColumnRow>
              <ChangeRate value={changeRateRender} isShowArrawIcon className="fw-600" />
            </ColumnRow>
          );
        },
      },
      {
        title: _t('markets'),
        dataIndex: 'allTrend',
        align: 'right',
        render(value, { changeRate1h, changeRate4h, changeRate24h, symbol }) {
          const changeRateArray = [changeRate1h, changeRate4h, changeRate24h];
          const renderLineMap =
            klinesMap && klinesMap[symbol] && klinesMap[symbol].length ? klinesMap[symbol] : [];
          return (
            <span>
              {renderLineMap.length ? (
                <Card
                  id={symbol}
                  key={symbol}
                  trend={renderLineMap}
                  symbol={symbol}
                  changeRate={+changeRateArray[activeRate] || 0}
                />
              ) : null}
            </span>
          );
        },
      },
      commonColumns.allChangeRate,
      commonColumns.openingTime,
      commonColumns.operations,
    ];
  }, [
    activeRate,
    commonColumns.allChangeRate,
    commonColumns.name,
    commonColumns.openingTime,
    commonColumns.operations,
    klinesMap,
  ]);

  const columns = useMemo(() => {
    const genFnMap = {
      sm: genSmColumns,
      md: genMdColumns,
      lg: genLgColumns,
    };
    const genFn = genFnMap[size];
    return genFn();
  }, [size, genSmColumns, genMdColumns, genLgColumns]);

  const _records = useMemo(() => {
    // 过滤数据
    const _list = [...records];
    const list = _list.sort(sorterFn);
    return isMore ? list : list.slice(0, 10);
  }, [records, isMore, sorterFn]);

  return (
    <>
      <TableLayer data-inspector="rocket_zone_new_currency_table" id="newCurrencyTable">
        <TableWrapper
          rowKey="currency"
          onChange={handleTableChange}
          dataSource={_records}
          columns={columns}
          loading={loadingTable || isChangingMore}
          pagination={false}
          onRow={(record) => ({ onClick: () => onRowClick(record) })}
          locale={{ emptyText: _t('table.empty') }}
          scroll={
            size === 'md'
              ? {
                  x: '100vw',
                }
              : undefined
          }
          headerType="filled"
        />
      </TableLayer>
      <MoreDivLayer>
        {loadingTable || _records.length === 0 ? null : (
          <MoreText onClick={showMore}>
            {isMore ? _t('2MtbEAqscGgqLzj8Fze5Pk') : _t('2YyXGzmRgscwyygscEYUgi')}
            <span className="down_icon">
              {isMore ? <ICArrowUpOutlined /> : <ICArrowDownOutlined />}
            </span>
          </MoreText>
        )}
      </MoreDivLayer>
    </>
  );
};
export default NewCurrencyTable;
