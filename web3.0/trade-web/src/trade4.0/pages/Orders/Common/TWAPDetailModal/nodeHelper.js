/**
 * Owner: harry.lai@kupotech.com
 */
import React from 'react';
import moment from 'moment';
import { dividedBy } from 'utils/operation';
import { _t } from 'utils/lang';
import { showDatetime } from 'helper';
import { NumberFormat } from '@kux/mui';
import { directions, DISTANCE_TYPE_MAP } from '../OrderConfig';
import EnhanceIndiaComplianceTipWrap from '../OrderListCommon/EnhanceIndiaComplianceTipWrap';
import { NumUnitComp } from './components';
import { SideText } from '../style';
import { convertSecondsToHMS } from '../presenter/time-util';

export const makeBaseInfoList = ({ currentLang }) => [
  {
    label: _t('nMAXJ2QkDFFxDGsUUTxv91'),
    key: 'createdAt',
    render(source) {
      return showDatetime(source);
    },
  },

  {
    label: _t('rYjf48JUnnePSCKaeNZmni'),
    key: 'side',
    render(source) {
      const sideTemp = directions.find(
        (dir) => dir.value.toUpperCase() === (source || '').toUpperCase(),
      );
      return <SideText side={(source || '').toUpperCase()}>{sideTemp && sideTemp.text()}</SideText>;
    },
  },

  {
    label: `${_t('orders.c.deal.size')}/${_t('orders.c.total.size')}`,
    key: 'fillAndAmount',
    render(_, records) {
      const { symbol, filledSize, size } = records;
      const [coin] = symbol?.split?.('-');
      return (
        <span>
          <NumUnitComp
            symbol={symbol}
            value={filledSize}
            precisionKey="pricePrecision"
            coin={coin}
            unitClassName="unit"
          />
          /
          <NumUnitComp
            symbol={symbol}
            value={size}
            precisionKey="pricePrecision"
            coin={coin}
            unitClassName="unit"
          />
        </span>
      );
    },
  },

  {
    label: _t('3Vxdu1Xchn2NhqKtXcA5kR'),
    key: 'singleOrderSize',
    render(source, records) {
      const { symbol } = records;

      const [coin] = symbol?.split?.('-');

      if (!source === undefined) {
        return '-';
      }
      return (
        <NumUnitComp
          symbol={symbol}
          value={source}
          precisionKey="pricePrecision"
          coin={coin}
          unitClassName="unit"
        />
      );
    },
  },

  {
    label: _t('rSix336ZRsxAVJ1YWYexUs'),
    key: 'orderDistance',
    render(_, records) {
      const { symbol, distanceType, distanceValue } = records;
      const distanceValueIsPrice = distanceType === DISTANCE_TYPE_MAP.FIXED;
      const [, unit] = symbol?.split?.('-');

      if (distanceValueIsPrice) {
        return (
          <NumUnitComp
            symbol={symbol}
            value={distanceValue}
            precisionKey="pricePrecision"
            coin={unit}
            unitClassName="unit"
          />
        );
      }

      return (
        distanceValue && (
          <NumberFormat
            lang={currentLang}
            options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          >
            {distanceValue}
          </NumberFormat>
        )
      );
    },
  },
  {
    label: _t('orders.c.avg'),
    key: 'avgPrice',
    render(_, records) {
      const { symbol, filledFunds, filledSize } = records;

      if ([filledFunds, filledSize].includes(undefined)) {
        return '-';
      }
      // (filledAmount": 成交总金额 /  "filledSize": 成交总数量)
      const avgPrice = dividedBy(filledFunds)(filledSize);
      const [, unit] = symbol?.split?.('-');

      return (
        <NumUnitComp
          symbol={symbol}
          value={avgPrice}
          precisionKey="pricePrecision"
          coin={unit}
          unitClassName="unit"
        />
      );
    },
  },

  {
    label: _t('d8f603e959aa4000a5cc'),
    key: 'durationSec',
    render(source) {
      const [hour, min, sec] = convertSecondsToHMS(source);

      return (
        <span>
          {`${hour}${_t('preview.countdown.hours')} ${min}${_t(
            'preview.countdown.minutes',
          )} ${sec}${_t('preview.countdown.seconds')}`}
        </span>
      );
    },
  },
];

export const cardListColumns = [
  {
    title: _t('nMAXJ2QkDFFxDGsUUTxv91'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt) => {
      return moment(createdAt).format('YYYY/MM/DD HH:mm:ss');
    },
  },
  {
    title: _t('orders.c.avg'),
    dataIndex: 'avgPrice',
    key: 'avgPrice',
    render: (_, records) => {
      const { symbol, dealSize, dealFunds } = records;
      const [, unit] = symbol.split('-');
      const avgPrice = dividedBy(dealFunds)(dealSize);
      return (
        <NumUnitComp
          symbol={symbol}
          value={avgPrice}
          precisionKey="pricePrecision"
          coin={unit}
          unitClassName="unit"
        />
      );
    },
  },

  {
    title: _t('trade.order.price'),
    dataIndex: 'price',
    key: 'price',
    render: (source, records) => {
      const { symbol } = records;
      const [, unit] = symbol.split('-');
      // (filledAmount": 成交总金额 /  "filledSize": 成交总数量)
      return (
        <NumUnitComp
          symbol={symbol}
          value={source}
          precisionKey="basePrecision"
          coin={unit}
          unitClassName="unit"
        />
      );
    },
  },
  {
    title: _t('orders.c.traded'),
    dataIndex: 'size',
    key: 'size',
    render: (source, records) => {
      const { symbol } = records;
      const [coin] = symbol.split('-');

      return (
        <NumUnitComp
          symbol={symbol}
          value={source}
          precisionKey="basePrecision"
          coin={coin}
          unitClassName="unit"
        />
      );
    },
  },
  {
    title: _t('orders.c.total.size'),
    dataIndex: 'dealSize',
    key: 'dealSize',
    render: (source, records) => {
      const { symbol } = records;
      const [coin] = symbol.split('-');

      return (
        <NumUnitComp
          symbol={symbol}
          value={source}
          precisionKey="pricePrecision"
          coin={coin}
          unitClassName="unit"
        />
      );
    },
  },

  {
    title: _t('orders.col.funds'),
    dataIndex: 'dealFunds',
    key: 'dealFunds',
    render: (dealFunds, b) => {
      const [, unit] = b.symbol.split('-');
      return (
        <NumUnitComp
          symbol={b.symbol}
          value={dealFunds}
          precisionKey="pricePrecision"
          coin={unit}
          unitClassName="unit"
        />
      );
    },
  },
  {
    title: _t('orders.col.fee'),
    dataIndex: 'fee',
    key: 'fee',
    render: (fee, records) => {
      const { symbol, tax, taxRate } = records;
      const [, unit] = symbol.split('-');
      return (
        <>
          <div className="flex-center kfe">
            <NumUnitComp
              symbol={symbol}
              value={fee}
              precisionKey="pricePrecision"
              coin={unit}
              unitClassName="unit"
            />
          </div>
          {tax && (
            <div className="flex-center kfe">
              <EnhanceIndiaComplianceTipWrap taxRate={taxRate}>
                <NumUnitComp
                  symbol={symbol}
                  value={tax}
                  precisionKey="pricePrecision"
                  coin={unit}
                  unitClassName="unit"
                />
              </EnhanceIndiaComplianceTipWrap>
            </div>
          )}
        </>
      );
    },
  },
];

export const tableColumns = [
  {
    title: _t('nMAXJ2QkDFFxDGsUUTxv91'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 140,
    render: (createdAt) => {
      return moment(createdAt).format('YYYY/MM/DD HH:mm:ss');
    },
  },
  {
    title: (
      <React.Fragment>
        <div>{_t('orders.c.avg')}/</div>
        <div>{_t('trade.order.price')}</div>
      </React.Fragment>
    ),
    dataIndex: 'avgPriceAndPrice',
    key: 'avgPriceAndPrice',
    width: 180,
    render: (_, records) => {
      const { symbol, dealSize, dealFunds, price } = records;
      const [, unit] = symbol.split('-');

      // (dealFunds": 成交总金额 /  "dealSize": 成交总数量)
      const avgPrice = dividedBy(dealFunds)(dealSize);
      return (
        <React.Fragment>
          <div>
            <NumUnitComp
              symbol={symbol}
              value={avgPrice}
              precisionKey="pricePrecision"
              coin={unit}
              unitClassName="unit"
            />
          </div>
          <div>
            <NumUnitComp
              symbol={symbol}
              value={price}
              precisionKey="basePrecision"
              coin={unit}
              unitClassName="unit"
            />
          </div>
        </React.Fragment>
      );
    },
  },
  {
    title: (
      <React.Fragment>
        <div>{_t('orders.c.traded')}/</div>
        <div>{_t('b8d74e3086574000aa36')}</div>
      </React.Fragment>
    ),
    dataIndex: 'filledAndAmount',
    key: 'filledAndAmount',
    width: 180,
    render: (_, records) => {
      const { symbol, dealSize, size } = records;
      const [coin] = symbol.split('-');

      return (
        <React.Fragment>
          <div>
            <NumUnitComp
              symbol={symbol}
              value={dealSize}
              precisionKey="pricePrecision"
              coin={coin}
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
    dataIndex: 'dealFunds',
    key: 'dealFunds',
    width: 160,
    render: (dealFunds, b) => {
      const [, unit] = b.symbol.split('-');
      return (
        <NumUnitComp
          symbol={b.symbol}
          value={dealFunds}
          precisionKey="pricePrecision"
          coin={unit}
          unitClassName="unit"
        />
      );
    },
  },
  {
    title: _t('orders.col.fee'),
    dataIndex: 'fee',
    key: 'fee',
    width: 140,
    render: (fee, records) => {
      const { symbol, tax, taxRate } = records;
      const [, unit] = symbol.split('-');
      return (
        <>
          <div className="flex-center kfe">
            <NumUnitComp
              symbol={symbol}
              value={fee}
              precisionKey="pricePrecision"
              coin={unit}
              unitClassName="unit"
            />
          </div>
          {tax && (
            <div className="flex-center kfe">
              <EnhanceIndiaComplianceTipWrap taxRate={taxRate}>
                <NumUnitComp
                  symbol={symbol}
                  value={tax}
                  precisionKey="pricePrecision"
                  coin={unit}
                  unitClassName="unit"
                />
              </EnhanceIndiaComplianceTipWrap>
            </div>
          )}
        </>
      );
    },
  },
];
