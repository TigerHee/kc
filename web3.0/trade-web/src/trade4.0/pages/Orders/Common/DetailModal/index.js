/**
 * Owner: jessie@kupotech.com
 */
import React, { useCallback, useMemo, useState, Fragment } from 'react';
import { includes, map } from 'lodash';
import moment from 'moment';
import { connect } from 'dva';
import { useResponsive } from '@kux/mui';
import Drawer from '@mui/Drawer';
import Button from '@mui/Button';
import Pagination from '@mui/Pagination';
import { Tabs } from '@mui/Tabs';
import Empty from '@mui/Empty';
import SymbolPrecision from '@/components/SymbolPrecision';
import CoinCodeToName from '@/components/CoinCodeToName';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import { ADVANCED_LIMIT_MODEL_MAP } from '@/pages/OrderForm/config.js';
import Tooltip from '@mui/Tooltip';
import { ICQuestionOutlined } from '@kux/icons';
import { useTheme } from '@emotion/react';
import { _t } from 'utils/lang';
import { divide } from 'helper';
import { types, stopMark } from '../OrderConfig';
import EnhanceIndiaComplianceTipWrap, {
  TooltipContent,
} from '../OrderListCommon/EnhanceIndiaComplianceTipWrap';

import {
  NumFormat,
  DetailContent,
  DetailBaseInfoContent,
  DetailListContent,
  DetailCardListContent,
  TabsWrapper,
  EmptyWrapper,
  ItemTitle,
  CoinCodeToNameWrapper,
  SpinWrapper,
  ButtonWrapper,
  PaginationWrapper,
  DialogWrapper,
} from '../style';

const { Tab } = Tabs;

const tabsKey = {
  baseinfo: 'baseinfo',
  detail: 'detail',
};

const NumUnitComp = ({ symbol, value, precisionKey, precisionCoin, coin, unitClassName }) => (
  <React.Fragment>
    <span className="mr-2">
      <SymbolPrecision
        symbol={symbol}
        value={value}
        precisionKey={precisionKey}
        coin={precisionCoin}
      />
    </span>

    <CoinCodeToNameWrapper className={unitClassName || ''}>
      <CoinCodeToName coin={coin} />
    </CoinCodeToNameWrapper>
  </React.Fragment>
);

const baseInfo = () => [
  {
    label: _t('orders.col.symbol'),
    key: 'symbol',
    render(source) {
      return <SymbolCodeToName code={source} />;
    },
  },
  {
    label: _t('orders.col.type'),
    key: 'type',
    render(resource, data) {
      const { displayType } = data;
      const find = types.find(({ value }) => value === (displayType || resource));
      if (includes(['GTC', 'FOK', 'IOC'], data?.timeInForce)) {
        return `${_t('gSwMLa4CkKnfuxZeVSwZCt')} (${ADVANCED_LIMIT_MODEL_MAP[
          data?.timeInForce
        ]?.label()})`;
      }
      if (find) {
        return find.text();
      } else {
        return '-';
      }
    },
  },
  {
    label: _t('orders.col.stopPrice'),
    key: 'stopPrice',
    render(resource, data) {
      const { stop, symbol, ocoTriggerType, displayType, triggerPrice } = data;
      const unit = symbol.split('-')[1];
      let type = stop;
      if (!stop) {
        return '-';
      }
      // 跟踪委托使用 triggerPrice 表示触发价
      if (String(displayType).includes('tso')) {
        resource = triggerPrice;
      }
      if (includes(['e_l_o', 'l_l_o'], ocoTriggerType)) {
        // 是否是限价单
        return '-';
      } else if (includes(['e_s_o', 'l_s_o'], ocoTriggerType)) {
        type = ocoTriggerType === 'l_s_o' ? 'loss' : 'entry';
      }
      return (
        <NumFormat>
          {stopMark[type]}
          <SymbolPrecision symbol={symbol} value={resource} precisionKey="pricePrecision" />
          <span className="coinName">
            <CoinCodeToName coin={unit} />
          </span>
        </NumFormat>
      );
    },
  },
  {
    label: _t('orders.col.stopTriggered'),
    key: 'stopTriggered',
    render(resource, data) {
      const { stop } = data;
      if (stop) {
        return resource ? _t('orders.y') : _t('orders.n');
      }
      return '-';
    },
  },
];

const avgFunds = {
  label: _t('orders.dealFunds'),
  key: 'dealFunds',
  render(source, data) {
    const { dealSize, symbol } = data;
    const unit = symbol.split('-')[1];
    const ret = divide(source, dealSize, 20);
    return source ? (
      <NumFormat>
        <SymbolPrecision symbol={symbol} value={ret} precisionKey="pricePrecision" />
        <span className="coinName">
          <CoinCodeToName coin={unit} />
        </span>
      </NumFormat>
    ) : (
      '-'
    );
  },
};

const advancedInfo = () => {
  return [
    {
      label: _t('eceb8dc75f244000a763'),
      key: 'postOnly',
      render(resource) {
        return resource ? _t('orders.postonly.enable') : _t('orders.postonly.disable');
      },
    },
    {
      label: _t('b62fc57050bc4000a554'),
      key: 'timeInForce',
    },
    {
      label: _t('39af019364e94000aec8'),
      key: 'stp',
      render(resource) {
        return resource || '-';
      },
    },
    {
      label: _t('797eca5f890b4000adc9'),
      key: 'hidden',
      render(resource) {
        return resource ? _t('orders.y') : _t('orders.n');
      },
    },
    {
      label: _t('4dd4cb248ab44000a9fc'),
      key: 'remark',
      render(resource) {
        return resource || '-';
      },
    },
  ];
};

const cardListColumns = () => {
  return [
    {
      title: _t('orders.col.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => {
        return moment(createdAt).format('YYYY/MM/DD HH:mm:ss');
      },
    },
    {
      title: _t('orders.col.dealFunds'),
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol, b) => {
        const [, unit] = symbol.split('-');
        return (
          <NumUnitComp symbol={symbol} value={b.price} precisionKey="pricePrecision" coin={unit} />
        );
      },
    },
    {
      title: _t('orders.col.size'),
      dataIndex: 'size',
      key: 'size',
      render: (a, b) => {
        const [baseCoin] = b.symbol.split('-');
        return (
          <NumUnitComp
            symbol={b.symbol}
            value={b.size}
            precisionKey="basePrecision"
            coin={baseCoin}
          />
        );
      },
    },
    {
      title: _t('orders.col.funds'),
      dataIndex: 'funds',
      key: 'funds',
      render: (funds, b) => {
        const [, unit] = b.symbol.split('-');
        return (
          <NumUnitComp symbol={b.symbol} value={funds} precisionKey="pricePrecision" coin={unit} />
        );
      },
    },
    {
      title: _t('orders.col.fee'),
      dataIndex: 'fee',
      key: 'fee',
      render: (fee, b) => {
        return (
          <>
            <div className="flex-center kfe">
              <NumUnitComp
                symbol={b.symbol}
                value={fee}
                precisionCoin={b.feeCurrency}
                coin={b.feeCurrency}
              />
            </div>
            {b.tax && (
              <div className="flex-center kfe">
                <EnhanceIndiaComplianceTipWrap taxRate={b.taxRate}>
                  <NumUnitComp
                    symbol={b.symbol}
                    value={b.tax}
                    precisionCoin={b.taxCurrency}
                    coin={b.taxCurrency}
                  />
                </EnhanceIndiaComplianceTipWrap>
              </div>
            )}
          </>
        );
      },
    },
  ];
};

const columns = (colors) => {
  return [
    {
      title: _t('orders.col.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      render: (createdAt) => {
        return moment(createdAt).format('YYYY/MM/DD HH:mm:ss');
      },
    },
    {
      title: (
        <React.Fragment>
          <div>{_t('orders.col.dealFunds')}/</div>
          <div>{_t('orders.col.size')}</div>
        </React.Fragment>
      ),
      dataIndex: 'symbol',
      key: 'symbol',
      width: 160,
      render: (symbol, records) => {
        const { price, size } = records;
        const [coin, unit] = symbol.split('-');
        return (
          <React.Fragment>
            <div>
              <NumUnitComp
                symbol={symbol}
                value={price}
                precisionKey="pricePrecision"
                coin={unit}
                unitClassName="unit"
              />
            </div>
            <div>
              <NumUnitComp
                symbol={symbol}
                value={size}
                precisionKey="basePrecision"
                coin={coin}
                unitClassName="unit"
              />
            </div>
          </React.Fragment>
        );
      },
    },
    {
      title: _t('orders.col.funds'),
      dataIndex: 'funds',
      key: 'funds',
      width: 160,
      render: (funds, b) => {
        const [, unit] = b.symbol.split('-');
        return (
          <NumUnitComp
            symbol={b.symbol}
            value={funds}
            precisionKey="pricePrecision"
            coin={unit}
            unitClassName="unit"
          />
        );
      },
    },
    {
      title: (
        <React.Fragment>
          <div>{_t('orders.col.fee')}</div>
        </React.Fragment>
      ),
      dataIndex: 'fee',
      key: 'fee',
      render: (fee, b) => {
        return (
          <>
            <div>
              <NumUnitComp
                symbol={b.symbol}
                value={fee}
                precisionCoin={b.feeCurrency}
                coin={b.feeCurrency}
                unitClassName="unit"
              />
            </div>
            {b.tax && (
              <div className="flex-center kfe">
                <Tooltip
                  size="small"
                  placement="top"
                  title={<TooltipContent taxRate={b.taxRate} />}
                >
                  <ICQuestionOutlined
                    size={12}
                    className="horizontal-flip-in-arabic mr-2"
                    color={colors.icon60}
                  />
                </Tooltip>
                <NumUnitComp
                  symbol={b.symbol}
                  value={b.tax}
                  precisionCoin={b.feeCurrency}
                  coin={b.feeCurrency}
                  unitClassName="unit"
                />
              </div>
            )}
          </>
        );
      },
    },
  ];
};

const mapRender = (item, value, data) => {
  return value == null ? '-' : item.render ? item.render(value, data) : value;
};

const _pagination = {};

const DetailModal = (props) => {
  const {
    dispatch,
    namespace,
    isMargin,
    visible,
    orderDetail: mapData,
    fillsRecords: tableData,
    pagination,
    onCancel,
    loading,
    keepMounted,
  } = props;
  const { total = 0, current = 1 } = pagination || {};
  const [activeTab, setActiveTab] = useState(tabsKey.baseinfo);
  const { sm } = useResponsive();

  const handleFillPageChange = useCallback(
    (e, page) => {
      dispatch({ type: `${namespace}/pullFills`, payload: { page, isMargin } });
    },
    [dispatch, namespace, isMargin],
  );

  const handleCancel = useCallback(() => {
    dispatch({ type: `${namespace}/resetData` });
    onCancel();
  }, [dispatch, namespace, onCancel]);

  const items = useMemo(() => {
    const isHistory = namespace === 'orderHistory';
    if (!mapData) {
      return [];
    }
    if (includes(mapData?.type, 'oco') || includes(mapData?.displayType, 'oco')) {
      return baseInfo();
    }
    return isHistory
      ? [...baseInfo(), avgFunds, ...advancedInfo()]
      : [...baseInfo(), ...advancedInfo()];
  }, [namespace, mapData]);

  const { colors } = useTheme();
  // 移动端
  if (!sm) {
    return (
      <DialogWrapper
        back={false}
        open={visible}
        onCancel={handleCancel}
        onOk={handleCancel}
        title={_t('orders.detail.title')}
        okText={_t('confirm')}
        cancelText=""
        size="large"
        footer={null}
        height="100%"
      >
        <SpinWrapper spinning={loading}>
          <div>
            <TabsWrapper>
              <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} size="small">
                <Tab label={_t('orders.detail.baseinfo')} value={tabsKey.baseinfo} />
                <Tab label={_t('orders.detail.detail')} value={tabsKey.detail} />
              </Tabs>
            </TabsWrapper>
            {activeTab === tabsKey.baseinfo ? (
              <DetailBaseInfoContent className="xs">
                {map(items, (item) => (
                  <div key={item.key} className="row">
                    <span className="label">{item.label}</span>
                    <span className="value">{mapRender(item, mapData[item.key], mapData)}</span>
                  </div>
                ))}
              </DetailBaseInfoContent>
            ) : !tableData?.length ? (
              <EmptyWrapper>
                <Empty />
              </EmptyWrapper>
            ) : (
              <React.Fragment>
                {map(tableData, (data, index) => {
                  return (
                    <DetailCardListContent key={index}>
                      {map(cardListColumns(colors), (item) => {
                        return (
                          <div key={item.key} className="row">
                            <span className="label">{item.title}</span>
                            <span className="value">{item.render(data[item.key], data)}</span>
                          </div>
                        );
                      })}
                    </DetailCardListContent>
                  );
                })}
                {total > 0 ? (
                  <PaginationWrapper style={{ padding: '24px 12px' }}>
                    <Pagination
                      total={total}
                      current={current}
                      onChange={handleFillPageChange}
                      pageSize={10}
                    />
                  </PaginationWrapper>
                ) : null}
              </React.Fragment>
            )}
          </div>
        </SpinWrapper>
      </DialogWrapper>
    );
  }
  return (
    <Drawer
      width="560px"
      back={false}
      show={visible}
      anchor="right"
      onClose={handleCancel}
      contentPadding="0"
      title={_t('orders.detail.title')}
      okText={_t('confirm')}
      keepMounted={!!keepMounted}
    >
      <SpinWrapper spinning={loading}>
        <DetailContent>
          <DetailBaseInfoContent>
            <ItemTitle>{_t('orders.detail.baseinfo')}</ItemTitle>
            {map(items, (item) => (
              <div key={item.key} className="row">
                <span className="label">{item.label}</span>
                <span className="value">{mapRender(item, mapData[item.key], mapData)}</span>
              </div>
            ))}
          </DetailBaseInfoContent>
          <DetailListContent>
            <ItemTitle>{_t('orders.detail.detail')}</ItemTitle>
            <div className="header">
              <div className="content">
                {map(columns(colors), (column) => {
                  return (
                    <div className="col" key={`header_${column.key}`}>
                      {column.title}
                    </div>
                  );
                })}
              </div>
            </div>

            {!tableData?.length ? (
              <EmptyWrapper>
                <Empty />
              </EmptyWrapper>
            ) : (
              <Fragment>
                <div className="list">
                  {map(tableData, (data, index) => {
                    return (
                      <div key={`data_${index}`} className="row">
                        {map(columns(colors), (item) => {
                          return (
                            <div key={item.key} className="col">
                              {item.render(data[item.key], data)}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </Fragment>
            )}
          </DetailListContent>
          {total > 0 ? (
            <PaginationWrapper>
              <Pagination
                total={total}
                current={current}
                onChange={handleFillPageChange}
                pageSize={10}
              />
            </PaginationWrapper>
          ) : null}
        </DetailContent>
        <ButtonWrapper>
          <Button onClick={handleCancel}>{_t('confirm')}</Button>
        </ButtonWrapper>
      </SpinWrapper>
    </Drawer>
  );
};

export default connect((state, props) => {
  const { namespace } = props;
  const { tradeType } = state.trade;
  const { orderDetail, fillsRecords, fillCurrent, fillTotal } = state[namespace];

  _pagination.fillCurrent = fillCurrent;
  _pagination.total = fillTotal;
  _pagination.current = fillCurrent || 1;

  const isMargin = tradeType === 'MARGIN_TRADE';
  return {
    orderDetail,
    fillsRecords,
    isMargin,
    pagination: _pagination,
    loading:
      state.loading.effects[`${namespace}/pullOrder`] ||
      state.loading.effects[`${namespace}/pullFills`],
  };
})(DetailModal);
