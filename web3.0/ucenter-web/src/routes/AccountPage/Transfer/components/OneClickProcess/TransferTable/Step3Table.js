/**
 * Owner: eli@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import NumberFormat from 'components/common/NumberFormat';
import { _t } from 'src/tools/i18n';
import CommonTable, { Coin, GreenText, RedText, TableRightColumn } from '../components/CommonTable';
import H5Table, { H5TableContent, H5TableTitle, RenderText } from '../components/H5CommonTable';
import {
  formatTradingPair,
  formatTs,
  getPairInfo,
  getSettleCurrency,
  getSideWrapper,
  SideText,
  SymbolName,
  TimeBox,
  tradeTypeName,
} from './columns';

export default function Step3Table({ tabs, curTab, data, onRow }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const total = data[curTab.value]?.length || 0;

  return isH5 ? (
    <H5TableContent>
      {Object.entries(h5Columns).map(([key, col]) => {
        const tab = tabs.find((tab) => tab.value === key);
        const h5Total = data[tab?.value]?.length || 0;
        const H5TableTitle = h5ColTitle[key] || H5ColCommonTitle;
        return (
          <H5Table
            key={key}
            columns={col}
            curTab={curTab}
            dataSource={data[tab?.value]}
            pagination={{ total: h5Total }}
            H5TableTitle={H5TableTitle}
            tab={{
              title: tab?.label,
              subTitle: tab?.note,
            }}
          />
        );
      })}
    </H5TableContent>
  ) : (
    <CommonTable
      curTab={curTab}
      columns={columns[curTab.value] || []}
      dataSource={data[curTab.value]}
      pagination={{ total }}
      onRow={onRow}
    />
  );
}

const columns = {
  // 币币当前委托
  spotOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '25%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('9cxpApngg3RP4p3hMGVnEx'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '25%',
      render: (text) => {
        return text ? formatTradingPair(text) : '';
      },
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '25%',
      render: (text) => {
        return <SideText text={text} />;
      },
    },
    {
      title: (
        <TableRightColumn>
          {_t('e67ca22a07c24800a6f3')}/{_t('e2c8b165b46f4000a431')}
        </TableRightColumn>
      ),
      dataIndex: 'price',
      key: 'price',
      width: '25%',
      render: (_, record) => {
        const { from, to } = getPairInfo(record.symbol);
        return (
          <TableRightColumn>
            <div>
              <NumberFormat>{record.price}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
            <div>
              <NumberFormat>{record.size || record.total || 0}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </TableRightColumn>
        );
      },
    },
  ],

  // 币币高级委托
  advanceSpotOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: '25%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('9cxpApngg3RP4p3hMGVnEx'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '25%',
      render: (text) => {
        return text ? formatTradingPair(text) : '';
      },
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '25%',
      render: (text = '') => {
        return <SideText text={text} />;
      },
    },
    {
      title: (
        <TableRightColumn>
          {_t('e67ca22a07c24800a6f3')}/{_t('e2c8b165b46f4000a431')}
        </TableRightColumn>
      ),
      dataIndex: 'price',
      key: 'price',
      width: '25%',
      render: (_, { symbol, type, totalFunds, totalSize, price }) => {
        const isTotalFunds =
          (type === 'market' || type === 'market_stop') && +totalFunds >= +totalSize;
        const amount = isTotalFunds ? totalFunds : totalSize;
        let { from, to } = getPairInfo(symbol);
        if (isTotalFunds) to = from;
        return (
          <TableRightColumn>
            {isTotalFunds ? (
              <div>-</div>
            ) : (
              <div>
                <NumberFormat>{price}</NumberFormat>
                <Coin>&nbsp;{from}</Coin>
              </div>
            )}
            <div>
              <NumberFormat>{amount}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </TableRightColumn>
        );
      },
    },
  ],

  // TWAP 订单
  advanceSpotTWAPOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '20%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('9cxpApngg3RP4p3hMGVnEx'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '20%',
      render: (text) => {
        return text ? formatTradingPair(text) : '';
      },
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '10%',
      render: (text) => {
        return <SideText text={text} />;
      },
    },
    // 测试同学(Lion): 先注释掉
    // {
    //   title: _t('order.avgPrice'),
    //   dataIndex: 'filledFunds',
    //   key: 'filledFunds',
    //   width: '20%',
    //   render: (_, record) => {
    //     // filledFunds / dealSize
    //     const filledFunds = Number(record.filledFunds);
    //     const dealSize = Number(record.dealSize);
    //     // if (filledFunds === 0 || dealSize === 0) return '';
    //     const result = filledFunds / dealSize;
    //     const coin = getPairInfo(record.symbol)?.from || '';
    //     return (
    //       <span>
    //         <NumberFormat>{result}</NumberFormat>
    //         <Coin>&nbsp;{coin}</Coin>
    //       </span>
    //     );
    //   },
    // },
    {
      title: `${_t('e2c8b165b46f4000a431')}/${_t('d29f5516020e4000aea2')}`,
      dataIndex: 'size',
      key: 'size',
      width: '20%',
      // size / dealSize
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <div>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
            <div>
              <NumberFormat>{record.dealSize}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </div>
        );
      },
    },
  ],

  // 杠杆当前委托
  marginOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '15%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('b43603aa977c4000aebf'),
      dataIndex: 'tradeType',
      key: 'tradeType',
      width: '15%',
      render: (text) => {
        return text ? tradeTypeName(text) : '';
      },
    },
    {
      title: _t('9cxpApngg3RP4p3hMGVnEx'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '15%',
      render: (text) => {
        return text ? formatTradingPair(text) : '';
      },
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '10%',
      render: (text) => {
        return <SideText text={text} />;
      },
    },
    {
      title: (
        <TableRightColumn>
          {_t('e67ca22a07c24800a6f3')}/{_t('e2c8b165b46f4000a431')}
        </TableRightColumn>
      ),
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (price, record) => {
        const { from, to } = getPairInfo(record.symbol);
        return (
          <TableRightColumn>
            <div>
              <NumberFormat>{price}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
            <div>
              <NumberFormat>{record.size}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </TableRightColumn>
        );
      },
    },
  ],

  // 杠杆高级委托
  advanceMarginOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '16.6%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('b43603aa977c4000aebf'),
      dataIndex: 'tradeType',
      key: 'tradeType',
      width: '16.6%',
      render: (text) => {
        return text ? tradeTypeName(text) : '';
      },
    },
    {
      title: _t('9cxpApngg3RP4p3hMGVnEx'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '16.6%',
      render: (text) => {
        return text ? formatTradingPair(text) : '';
      },
    },
    {
      title: _t('sysqKHEWA1gYGJfJo1dp61'),
      dataIndex: 'tradeType',
      key: 'tradeType',
      width: '16.6%',
      render: () => {
        return _t('b1ae8171b7f44000a014');
      },
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '16.6%',
      render: (text) => {
        return <SideText text={text} />;
      },
    },
    {
      title: (
        <TableRightColumn>
          {_t('e67ca22a07c24800a6f3')}/{_t('e2c8b165b46f4000a431')}
        </TableRightColumn>
      ),
      dataIndex: 'price',
      key: 'price',
      width: '16.6%',
      render: (text, { size, symbol }) => {
        let { from, to } = getPairInfo(symbol);
        return (
          <TableRightColumn>
            <div>
              <NumberFormat>{text ?? '-'}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
            <div>
              <NumberFormat>{size ?? '-'}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </TableRightColumn>
        );
      },
    },
  ],
  // 合约当前委托
  futuresOrderList: [
    {
      title: _t('39RMYLaRtYHsAF6MPqNcuq'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '25%',
      render: (text) => {
        return <SymbolName symbol={text} />;
      },
    },
    {
      title: _t('sysqKHEWA1gYGJfJo1dp61'),
      dataIndex: 'side',
      key: 'side',
      width: '25%',
      render: (text) => {
        if (!text) {
          return '--';
        }
        const Wrapper = getSideWrapper(text);
        return (
          <Wrapper>
            {text.toLowerCase() === 'buy' ? _t('vnAf2EMB5Ncd4W6embc2jT') : _t('follow.short')}
          </Wrapper>
        );
      },
    },
    {
      title: (
        <TableRightColumn>
          {_t('e67ca22a07c24800a6f3')}/{_t('amount')}
        </TableRightColumn>
      ),
      dataIndex: 'price',
      key: 'price',
      width: '25%',
      render: (price, record) => {
        return (
          <TableRightColumn>
            <div>
              <NumberFormat>{price}</NumberFormat>
              <Coin>&nbsp;{record.settleCurrency}</Coin>
            </div>
            <div>
              <NumberFormat>{record.size}</NumberFormat>
              <Coin>&nbsp;{_t('1eac54fd1d834800a919')}</Coin>
            </div>
          </TableRightColumn>
        );
      },
    },
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '25%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
  ],

  // 合约高级委托
  advanceFuturesOrderList: [
    {
      title: _t('39RMYLaRtYHsAF6MPqNcuq'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '20%',
      render: (text) => {
        return <SymbolName symbol={text} />;
      },
    },
    {
      title: _t('sysqKHEWA1gYGJfJo1dp61'),
      dataIndex: 'side',
      key: 'side',
      width: '25%',
      render: (text) => {
        if (!text) {
          return '--';
        }
        const Wrapper = getSideWrapper(text);
        return (
          <Wrapper>
            {text.toLowerCase() === 'buy' ? _t('vnAf2EMB5Ncd4W6embc2jT') : _t('follow.short')}
          </Wrapper>
        );
      },
    },
    // 本期去除该列
    // {
    //   title: '触发价格',
    //   dataIndex: 'triggerPrice',
    //   key: 'triggerPrice',
    //   width: '20%',
    // },
    {
      title: _t('amount'),
      dataIndex: 'size',
      key: 'size',
      width: '20%',
      render: (size, record) => {
        return (
          <div>
            <NumberFormat>{size}</NumberFormat>
            <Coin>&nbsp;{_t('1eac54fd1d834800a919')}</Coin>
          </div>
        );
      },
    },
    {
      title: _t('time'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '20%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
  ],
  // 盘前交易
  preMarketOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '20%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('9cxpApngg3RP4p3hMGVnEx'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '20%',
      render: (text) => {
        return text ? formatTradingPair(text) : '';
      },
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '20%',
      render: (text) => {
        return <SideText text={text} />;
      },
    },
    {
      title: <TableRightColumn>{_t('uVpe55QPWCqq96bxr2LCLM')}</TableRightColumn>,
      dataIndex: 'price',
      key: 'price',
      width: '20%',
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{from}</Coin>
          </TableRightColumn>
        );
      },
    },
    {
      title: <TableRightColumn>{_t('e2c8b165b46f4000a431')}</TableRightColumn>,
      dataIndex: 'size',
      key: 'size',
      width: '20%',
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{to}</Coin>
          </TableRightColumn>
        );
      },
    },
  ],
  // 闪兑
  speedOrderList: [
    {
      title: _t('margin.entrustList.title.entrustDate'),
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: '25%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: <TableRightColumn>{_t('b05534c1ccd94000a8c2')}</TableRightColumn>,
      dataIndex: 'fromSize',
      key: 'fromSize',
      width: '25%',
      render: (text, record) => {
        const coin = record.fromCurrency || '';
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{coin}</Coin>
          </TableRightColumn>
        );
      },
    },
    {
      title: <TableRightColumn>{_t('32793b2257e34800a0f0')}</TableRightColumn>,
      dataIndex: 'toSize',
      key: 'toSize',
      width: '25%',
      render: (text, record) => {
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.toCurrency}</Coin>
          </TableRightColumn>
        );
      },
    },
    {
      title: <TableRightColumn>{_t('uVpe55QPWCqq96bxr2LCLM')}</TableRightColumn>,
      dataIndex: 'price',
      key: 'price',
      width: '25%',
      render: (text, record) => {
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.toCurrency}</Coin>
          </TableRightColumn>
        );
      },
    },
  ],
};

const h5Columns = {
  // 币币当前委托
  spotOrderList: [
    {
      // 委托价
      ...columns.spotOrderList[3],
      title: _t('e67ca22a07c24800a6f3'),
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.spotOrderList[0]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 委托数量
    {
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      key: 'size',
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.spotOrderList[1]} record={record}>
            <div>
              <NumberFormat>{text || record.total || 0}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      ...columns.spotOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.spotOrderList[2]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
  ],
  // 币币高级委托
  advanceSpotOrderList: [
    {
      // 委托价
      ...columns.advanceSpotOrderList[3],
      title: _t('e67ca22a07c24800a6f3'),
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.advanceSpotOrderList[0]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 委托数量
    {
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      key: 'size',
      render: (_, record) => {
        const { symbol, type, totalFunds, totalSize } = record;
        const isTotalFunds =
          (type === 'market' || type === 'market_stop') && +totalFunds >= +totalSize;
        const amount = isTotalFunds ? totalFunds : totalSize;
        const { to } = getPairInfo(symbol);
        return (
          <RenderText column={h5Columns.advanceSpotOrderList[1]} record={record}>
            <div>
              <NumberFormat>{amount}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 委托时间
    {
      ...columns.advanceSpotOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.advanceSpotOrderList[2]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
  ],
  // TWAP 订单
  advanceSpotTWAPOrderList: [
    // 委托时间
    {
      ...columns.advanceSpotTWAPOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.advanceSpotTWAPOrderList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    // 测试同学(Lion): 先注释掉
    // {
    //   // 成交均价
    //   title: _t('order.avgPrice'),
    //   dataIndex: 'filledFunds',
    //   key: 'filledFunds',
    //   render: (text, record) => {
    //     const filledFunds = Number(record.filledFunds);
    //     const dealSize = Number(record.dealSize);
    //     const result = filledFunds / dealSize;
    //     const { from } = getPairInfo(record.symbol);
    //     return (
    //       <RenderText column={h5Columns.advanceSpotTWAPOrderList[1]} record={record}>
    //         <div>
    //           <NumberFormat>{result}</NumberFormat>
    //           <Coin>&nbsp;{from}</Coin>
    //         </div>
    //       </RenderText>
    //     );
    //   },
    // },
    // 已成交量
    {
      title: _t('d29f5516020e4000aea2'),
      dataIndex: 'dealSize',
      key: 'dealSize',
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.advanceSpotTWAPOrderList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 委托量
    {
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      key: 'size',
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.advanceSpotTWAPOrderList[3]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
  ],
  // 杠杆当前委托
  marginOrderList: [
    {
      // 委托价
      ...columns.marginOrderList[4],
      title: _t('e67ca22a07c24800a6f3'),
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.marginOrderList[0]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 委托数量
    {
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      key: 'size',
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.marginOrderList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 委托时间
    {
      ...columns.marginOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.marginOrderList[2]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
  ],
  // 杠杆高级委托
  advanceMarginOrderList: [
    {
      // 委托时间
      ...columns.advanceMarginOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.advanceMarginOrderList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    {
      // 委托价格
      title: _t('e67ca22a07c24800a6f3'),
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.advanceMarginOrderList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 委托数量
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      key: 'size',
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.advanceMarginOrderList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
  ],
  // 合约当前委托
  futuresOrderList: [
    {
      // 委托时间
      ...columns.futuresOrderList[3],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.futuresOrderList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    {
      // 委托价格
      ...columns.futuresOrderList[2],
      title: _t('e67ca22a07c24800a6f3'),
      render: (text, record) => {
        const coin = getSettleCurrency(record.settleCurrency);
        return (
          <RenderText column={h5Columns.futuresOrderList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{coin}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 委托数量
      ...columns.futuresOrderList[2],
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.futuresOrderList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{_t('1eac54fd1d834800a919')}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    // 订单价值
    {
      ...columns.futuresOrderList[1],
      title: _t('a662e39debf04800addd'),
      render: (_, record) => {
        const result = record.size * record.price;
        const coin = getSettleCurrency(record.settleCurrency);
        return (
          <RenderText column={h5Columns.futuresOrderList[3]} record={record}>
            <div>
              <NumberFormat>{result}</NumberFormat>
              <Coin>&nbsp;{coin}</Coin>
            </div>
          </RenderText>
        );
      },
    },
  ],
  // 合约高级委托
  advanceFuturesOrderList: [
    {
      // 委托时间
      ...columns.advanceFuturesOrderList[3],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.advanceFuturesOrderList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    {
      // 委托数量
      title: _t('e2c8b165b46f4000a431'),
      dataIndex: 'size',
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.advanceFuturesOrderList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{_t('1eac54fd1d834800a919')}</Coin>
            </div>
          </RenderText>
        );
      },
    },
  ],
  // 盘前交易
  preMarketOrderList: [
    {
      // 委托时间
      ...columns.preMarketOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.preMarketOrderList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    {
      // 价格
      ...columns.preMarketOrderList[3],
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        return (
          <RenderText column={columns.preMarketOrderList[3]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 委托数量
      ...columns.preMarketOrderList[4],
      render: (text, record) => {
        const { to } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.preMarketOrderList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{to}</Coin>
            </div>
          </RenderText>
        );
      },
    },
  ],
  // 闪兑
  speedOrderList: [
    {
      // 委托时间
      ...columns.speedOrderList[0],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.speedOrderList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    {
      // 兑换
      ...columns.speedOrderList[1],
      dataIndex: 'fromSize',
      key: 'fromSize',
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.speedOrderList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.fromCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 收到
      ...columns.speedOrderList[2],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.speedOrderList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.toCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 价格
      ...columns.speedOrderList[3],
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.speedOrderList[3]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.toCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
  ],
};

const H5ColCommonTitle = ({ record }) => {
  const side = record.side?.toLowerCase?.() || '';
  const sideMap = {
    buy: <GreenText>{_t('buy')}</GreenText>,
    sell: <RedText>{_t('sell')}</RedText>,
  };

  return (
    <H5TableTitle title={<SymbolName symbol={record.symbol} />} subTitle={sideMap[side] || ''} />
  );
};

const H5StockColCommonTitle = ({ record }) => {
  const side = record.side?.toLowerCase();

  const sideMap = {
    buy: <GreenText>{_t('vnAf2EMB5Ncd4W6embc2jT')}</GreenText>,
    sell: <RedText>{_t('follow.short')}</RedText>,
  };

  return (
    <H5TableTitle title={<SymbolName symbol={record.symbol} />} subTitle={sideMap[side] || ''} />
  );
};

// futuresOrderList: true,
// advanceFuturesOrderList: true,

const h5ColTitle = {
  // spotOrderList: H5ColCommonTitle,
  // advanceSpotOrderList: H5ColCommonTitle,
  // advanceSpotTWAPOrderList: H5ColCommonTitle,
  // marginOrderList: H5ColCommonTitle,
  // advanceMarginOrderList: H5ColCommonTitle,
  // preMarketOrderList: H5ColCommonTitle,
  // speedOrderList: () => {
  //   return <H5TableTitle />;
  // },
  speedOrderList: H5TableTitle,

  futuresOrderList: H5StockColCommonTitle,
  advanceFuturesOrderList: H5StockColCommonTitle,
  // leveragedTokensOrderList: ({ record }) => {
  //   const pair = formatTradingPair(record.symbol);
  //   const Wrapper = record.side === 'buy' ? GreenText : RedText;
  //   return <H5TableTitle title={pair} subTitle={<Wrapper>{record.side}</Wrapper>} />;
  // },
};
