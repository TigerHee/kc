/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Table, NumberFormat, Button, Tabs, Tab } from '@kux/mui';
import { useResponsive } from '@kux/mui/hooks';
import { useLocale } from '@kucoin-base/i18n';
import { _t, addLangToPath } from 'src/tools/i18n';
import { searchMarketList } from 'services/landingpage';
import ChangingNumber from 'components/common/ChangingNumber';
import ChangeRate from 'components/common/ChangeRate';
import { isNumValid, getPrecisionFromIncrement } from 'helper';
import siteConfig from 'utils/siteConfig';
import { pullSymbols } from 'services/market';
import TimeSelect from 'components/Landing/TimeSelect';
import {
  Wrapper,
  TableWrapper,
  SymbolCode,
  SymbolWrapper,
  FutureSymbol,
  ColumnRow,
  Row,
  PriceRow,
  CoinCurrencyWrapper,
  RowWrapper,
  ColWrapper,
  ColTitle,
  ColContent,
  DataWrapper,
  ActionWrapper,
  Line,
} from './PriceTable.style';
import { BtnWrapper } from './index.style';

const { KUCOIN_HOST, KUMEX_HOST } = siteConfig;

const defaultRate = 'changeRate24h';

const TabConfig = {
  SPOT: 'SPOT',
  FUTURE: 'FUTURE',
};

const PriceTable = () => {
  const [dataSource, setDataSource] = useState([]);
  const { currentLang } = useLocale();
  const [changeRateType, setChangeRateType] = useState(defaultRate);
  const [currentTab, setCurrentTab] = useState(TabConfig.SPOT);
  const [futureInfo, setFutureInfo] = useState();
  const responsive = useResponsive();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTab === TabConfig.FUTURE && !futureInfo) {
      setLoading(true);
      pullSymbols().then((res) => {
        // ETHUSDTM
        setLoading(false);
        if (res.success && res.data) {
          const ethRuture = res.data.find((item) => {
            return item.symbol === 'ETHUSDTM';
          });
          setFutureInfo({
            tickSize: ethRuture.tickSize,
            baseCurrency: ethRuture.baseCurrency,
            quoteCurrency: ethRuture.quoteCurrency,
          });
        }
      });
    }
  }, [currentTab, futureInfo]);

  useEffect(() => {
    const param = {
      currentPage: 1,
      keyword: 'ETH',
      pageSize: 30,
      tabType: currentTab,
    };
    if (currentTab === TabConfig.SPOT) {
      param.subCategory = 'USDT';
    }
    setLoading(true);
    searchMarketList(param).then((res) => {
      setLoading(false);
      if (res.success && res?.data?.data) {
        const list = res.data.data || [];
        const marketsList = list.filter((item) => {
          if (currentTab === TabConfig.SPOT) {
            return item.symbolCode === 'ETH-USDT';
          } else {
            return item.symbolCode === 'ETHUSDTM';
          }
        });
        setDataSource(marketsList);
      }
    });
  }, [currentTab]);

  const renderSymbolCode = useCallback(
    (record) => {
      if (!record) {
        return '--';
      }
      const path =
        currentTab === TabConfig.SPOT
          ? `${KUCOIN_HOST}/trade/${record}`
          : `${KUMEX_HOST}/trade/${record}`;
      if (currentTab === TabConfig.SPOT) {
        const symbols = record.split('-') || [];
        return (
          <SymbolWrapper href={addLangToPath(path)}>
            <SymbolCode responsive={responsive}>{symbols[0]}</SymbolCode>/{symbols[1]}
          </SymbolWrapper>
        );
      } else {
        return (
          <FutureSymbol href={addLangToPath(path)}>
            ETH
            {_t('contract.detail.perpetual')}/ USDT
          </FutureSymbol>
        );
      }
    },
    [currentTab, responsive],
  );

  const renderLastTradePrice = useCallback(
    (record) => {
      if (!record) {
        return '--';
      }
      let { lastTradePrice, trading, quoteCurrency, baseCurrency, pricePrecision } = record;
      if (!isNumValid(lastTradePrice) || (currentTab === TabConfig.SPOT && !trading)) {
        return '--';
      }
      if (currentTab === TabConfig.FUTURE) {
        quoteCurrency = futureInfo?.quoteCurrency;
        baseCurrency = futureInfo?.baseCurrency;
        pricePrecision = getPrecisionFromIncrement(futureInfo?.tickSize) || 0;
      }
      return (
        <PriceRow responsive={responsive}>
          <ChangingNumber value={lastTradePrice} showIcon={false}>
            <NumberFormat
              lang={currentLang}
              options={{
                maximumFractionDigits: pricePrecision,
              }}
            >
              {lastTradePrice}
            </NumberFormat>
          </ChangingNumber>
          <Line>/</Line>
          <CoinCurrencyWrapper
            baseCurrency={baseCurrency}
            quoteCurrency={quoteCurrency}
            value={lastTradePrice}
            className={'currencyAmount'}
          />
        </PriceRow>
      );
    },
    [currentTab, futureInfo, currentLang, responsive],
  );

  const render24price = useCallback(
    (record) => {
      if (!record) {
        return '--';
      }
      let { high, low, trading, pricePrecision } = record;
      if (!trading && currentTab === TabConfig.SPOT) {
        return '--';
      }
      if (currentTab === TabConfig.FUTURE) {
        pricePrecision = getPrecisionFromIncrement(futureInfo?.tickSize) || 0;
      }
      return (
        <Row responsive={responsive}>
          {!high ? (
            '--'
          ) : (
            <NumberFormat
              lang={currentLang}
              options={{
                maximumFractionDigits: pricePrecision,
              }}
            >
              {high}
            </NumberFormat>
          )}
          <Line>/</Line>
          {!low ? (
            '--'
          ) : (
            <NumberFormat
              lang={currentLang}
              options={{
                maximumFractionDigits: pricePrecision,
              }}
            >
              {low}
            </NumberFormat>
          )}
        </Row>
      );
    },
    [futureInfo, currentTab, currentLang, responsive],
  );

  const renderOperation = useCallback(
    (symbolCode) => {
      if (!symbolCode) {
        return '';
      }
      const path =
        currentTab === TabConfig.SPOT
          ? `${KUCOIN_HOST}/trade/${symbolCode}`
          : `${KUMEX_HOST}/trade/${symbolCode}`;
      return (
        <BtnWrapper>
          <Button as="a" href={addLangToPath(path)}>
            {_t('5UN3CCvuE1FacDJMbbk55S')}
          </Button>
        </BtnWrapper>
      );
    },
    [currentTab],
  );

  const getColumns = useCallback(() => {
    const columns = [
      {
        title: _t('aR8RhyLNkGyEBQM9tguQDn'),
        dataIndex: 'symbolCode',
        key: 'symbolCode',
        width: '22%',
        render: (record) => {
          return renderSymbolCode(record);
        },
      },
      {
        title: _t('convert.order.price'),
        dataIndex: 'lastTradePrice',
        key: 'lastTradePrice',
        width: '22%',
        render: (text, record) => {
          return renderLastTradePrice(record);
        },
      },
      {
        title: () => {
          return <TimeSelect changeType={setChangeRateType} />;
        },
        dataIndex: 'changeRate',
        key: 'changeRate',
        width: '22%',
        render: (_, record) => {
          return (
            <ColumnRow>
              <ChangeRate value={record[changeRateType]} isShowArrawIcon className="fw-600" />
            </ColumnRow>
          );
        },
      },
      {
        title: _t('wB5qE7v6WWDLFSA6YcEsVR'),
        dataIndex: '24price',
        key: '24price',
        width: '22%',
        render: (_, record) => {
          return render24price(record);
        },
      },
      {
        title: '',
        dataIndex: 'operation',
        key: 'operation',
        width: '12%',
        fixed: 'right',
        render: (_, { symbolCode }) => {
          return renderOperation(symbolCode);
        },
      },
    ];
    return columns;
  }, [changeRateType, render24price, renderLastTradePrice, renderOperation, renderSymbolCode]);

  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Wrapper>
      <Tabs value={currentTab} onChange={handleTabChange} variant="line" showScrollButtons={false}>
        <Tab label={_t('spot')} value={TabConfig.SPOT} />
        <Tab label={_t('head.contracts')} value={TabConfig.FUTURE} />
      </Tabs>
      <TableWrapper responsive={responsive}>
        {responsive.lg ? (
          <Table columns={getColumns()} dataSource={dataSource} loading={loading} />
        ) : (
          <React.Fragment>
            <DataWrapper>
              <RowWrapper>
                <ColWrapper>
                  <ColTitle responsive={responsive}>{_t('aR8RhyLNkGyEBQM9tguQDn')}</ColTitle>
                  <ColContent>{renderSymbolCode(dataSource[0]?.symbolCode)}</ColContent>
                </ColWrapper>
                <ColWrapper>
                  <ColTitle responsive={responsive}>{_t('convert.order.price')}</ColTitle>
                  <ColContent>{renderLastTradePrice(dataSource[0])}</ColContent>
                </ColWrapper>
              </RowWrapper>
              <RowWrapper>
                <ColWrapper>
                  <ColTitle responsive={responsive}>
                    <TimeSelect changeType={setChangeRateType} />
                  </ColTitle>
                  <ColContent>
                    <ColumnRow>
                      <ChangeRate
                        value={dataSource && dataSource[0] && dataSource[0][changeRateType]}
                        isShowArrawIcon
                        className="fw-600"
                      />
                    </ColumnRow>
                  </ColContent>
                </ColWrapper>
                <ColWrapper>
                  <ColTitle responsive={responsive}>{_t('wB5qE7v6WWDLFSA6YcEsVR')}</ColTitle>
                  <ColContent>{render24price(dataSource[0])}</ColContent>
                </ColWrapper>
              </RowWrapper>
            </DataWrapper>
            <ActionWrapper responsive={responsive}>
              {renderOperation(dataSource[0]?.symbolCode)}
            </ActionWrapper>
          </React.Fragment>
        )}
      </TableWrapper>
    </Wrapper>
  );
};

export default PriceTable;
