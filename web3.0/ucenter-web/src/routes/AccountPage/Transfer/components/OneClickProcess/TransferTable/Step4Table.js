/**
 * Owner: eli@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import NumberFormat from 'src/components/common/NumberFormat';
import { _t } from 'src/tools/i18n';
import CommonTable, { Coin, GreenText, RedText, TableRightColumn } from '../components/CommonTable';
import H5Table, { H5TableContent, H5TableTitle, RenderText } from '../components/H5CommonTable';
import { formatTs, getPairInfo, SymbolName, TimeBox } from './columns';

export default function Step4Table({ data, curTab, tabs, onRow }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const total = data[curTab.value]?.length || 0;

  return isH5 ? (
    <H5TableContent>
      {Object.entries(h5Columns).map(([key, col]) => {
        const tab = tabs.find((tab) => tab.value === key);
        const h5Total = data[tab.value]?.length || 0;
        return (
          <H5Table
            key={key}
            columns={col}
            curTab={curTab}
            dataSource={data[tab.value]}
            pagination={{ total: h5Total }}
            H5TableTitle={h5ColTitle[key]}
            tab={{
              title: tab.label,
              subTitle: tab.note,
            }}
          />
        );
      })}
    </H5TableContent>
  ) : (
    <CommonTable
      curTab={curTab}
      columns={columns[curTab.value]}
      dataSource={data[curTab.value]}
      pagination={{ total }}
      onRow={onRow}
    />
  );
}

const columns = {
  // 期货持仓信息
  futuresPositionList: [
    {
      title: _t('39RMYLaRtYHsAF6MPqNcuq'),
      dataIndex: 'symbol',
      key: 'symbol',
      width: '25%',
      render: (text, record) => {
        const Wrapper = Number(record.currentQty) >= 0 ? GreenText : RedText;
        const crossMode = record.crossMode ? _t('cross') : _t('isolated');
        return (
          <div>
            <div>
              <SymbolName symbol={text} />
            </div>
            <SubLine>
              <Wrapper>
                {record.currentQty >= 0 ? _t('vnAf2EMB5Ncd4W6embc2jT') : _t('follow.short')}
              </Wrapper>
              <div>{crossMode}</div>
              <div>
                <NumberFormat options={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}>
                  {record.leverage}
                </NumberFormat>
                x
              </div>
            </SubLine>
          </div>
        );
      },
    },
    {
      title: _t('amount'),
      dataIndex: 'currentQty',
      key: 'currentQty',
      width: '25%',
      render: (text, record) => {
        return (
          <div>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{_t('1eac54fd1d834800a919')}</Coin>
          </div>
        );
      },
    },
    {
      // title: '开仓价格/标记价格',
      title: (
        <TableRightColumn>
          {_t('assets.position.entryPrice')}/{_t('refer.markPrice')}
        </TableRightColumn>
      ),
      dataIndex: 'avgEntryPrice',
      key: 'avgEntryPrice',
      width: '25%',
      render: (text, record) => {
        return (
          <TableRightColumn>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.settleCurrency}</Coin>
            </div>
            <div>
              <NumberFormat>{record.markPrice}</NumberFormat>
              <Coin>&nbsp;{record.settleCurrency}</Coin>
            </div>
          </TableRightColumn>
        );
      },
    },
    {
      // title: '未实现盈亏 (收益率)',
      title: (
        <TableRightColumn>
          {_t('assets.unrealisedPNL')}({_t('d15dfd1e0c1b4000ad24')})
        </TableRightColumn>
      ),
      dataIndex: 'unrealisedRoePcnt',
      key: 'unrealisedRoePcnt',
      width: '25%',
      render: (_, record) => {
        // 如果小于 0.00001，显示为 < + 0.00001
        let pnl = Number(record.unrealisedPnl) || 0;
        const Wrapper = pnl >= 0 ? GreenText : RedText;

        if (0 < pnl && pnl < 0.00001) {
          pnl = '< + 0.00001';
        } else if (-0.00001 < pnl && pnl < 0) {
          pnl = '< - 0.00001';
        } else {
          pnl = <NumberFormat isPositive={pnl > 0 || pnl < 0}>{pnl}</NumberFormat>;
        }
        return (
          <TableRightColumn>
            <div>
              <Wrapper>{pnl}</Wrapper>
              <Coin>&nbsp;{record.settleCurrency}</Coin>
            </div>
            <div>
              <Wrapper>
                {typeof record.unrealisedRoePcnt === 'number' ||
                typeof record.unrealisedRoePcnt === 'string' ? (
                  <NumberFormat isPositive options={{ style: 'percent' }}>
                    {record.unrealisedRoePcnt}
                  </NumberFormat>
                ) : (
                  '--'
                )}
              </Wrapper>
            </div>
          </TableRightColumn>
        );
      },
    },
  ],

  // 期权持仓信息
  marginOptionList: [
    {
      title: _t('a278f73e58494800a9f1'),
      dataIndex: 'token',
      key: 'token',
      width: '25%',
    },
    {
      title: _t('earn.account.tableStaking.endTime'),
      dataIndex: 'deadline',
      key: 'deadline',
      width: '25%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('11ce50262e414000aae4'),
      dataIndex: 'totalSize',
      key: 'totalSize',
      width: '25%',
      render: (text) => (
        <div>
          <NumberFormat>{text}</NumberFormat>
          <span>&nbsp;{_t('1eac54fd1d834800a919')}</span>
        </div>
      ),
    },
  ],

  // 全仓杠杆仓位
  marginPositionList: [
    {
      title: _t('vote.coin-type'),
      dataIndex: 'token',
      key: 'token',
      width: '33.3%',
    },
    {
      title: <TableRightColumn>{_t('asset.debts')}</TableRightColumn>,
      dataIndex: 'totalSize',
      key: 'totalSize',
      width: '33.3%',
      render: (text, record) => (
        <TableRightColumn>
          <NumberFormat>{text}</NumberFormat>
          <Coin>&nbsp;{record.token}</Coin>
        </TableRightColumn>
      ),
    },
    {
      title: <TableRightColumn>{_t('assets')}</TableRightColumn>,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: '33.3%',
      render: (text, record) => (
        <TableRightColumn>
          <NumberFormat>{text}</NumberFormat>
          <Coin>&nbsp;{record.token}</Coin>
        </TableRightColumn>
      ),
    },
  ],

  // 逐仓杠杆持仓信息
  marginIsolatedPositionList: [
    {
      title: _t('as1BsgsURUCW6mTPrEtiv8'),
      dataIndex: 'baseCurrency',
      key: 'baseCurrency',
      width: '33.3%',
      render: (text, record) => {
        return `${text} / ${record.quoteCurrency}`;
      },
    },
    {
      title: (
        <TableRightColumn>
          {_t('74c5f7fdfc3a4800a903')}/{_t('assets')}
        </TableRightColumn>
      ),
      dataIndex: 'baseLiabilitySize',
      key: 'baseLiabilitySize',
      width: '33.3%',
      render: (text, record) => (
        <TableRightColumn>
          <NumberFormat>{text}</NumberFormat>
          <Coin>&nbsp;{record.baseCurrency}</Coin>
          <span>&nbsp;/&nbsp;</span>
          <NumberFormat>{record.baseBalance}</NumberFormat>
          <Coin>&nbsp;{record.baseCurrency}</Coin>
        </TableRightColumn>
      ),
    },
    {
      title: (
        <TableRightColumn>
          {_t('08ae8e959c9b4000a4c3')}/{_t('assets')}
        </TableRightColumn>
      ),
      dataIndex: 'quoteLiabilitySize',
      key: 'quoteLiabilitySize',
      width: '33.3%',
      render: (text, record) => (
        <TableRightColumn>
          <NumberFormat>{text}</NumberFormat>
          <Coin>&nbsp;{record.quoteCurrency}</Coin>
          <span>&nbsp;/&nbsp;</span>
          <NumberFormat>{record.quoteBalance}</NumberFormat>
          <Coin>&nbsp;{record.quoteCurrency}</Coin>
        </TableRightColumn>
      ),
    },
  ],

  // 杠杆代币持仓信息
  leveragedTokensList: [
    {
      title: _t('f818678bbd5c4000a437'),
      dataIndex: 'token',
      key: 'token',
    },
    {
      title: _t('iTPSTghXiVpg9Vo9ssGmKQ'),
      dataIndex: 'totalSize',
      key: 'totalSize',
      render: (text) => <NumberFormat>{text}</NumberFormat>,
    },
  ],
};

const h5Columns = {
  // 合约仓位
  futuresPositionList: [
    {
      // 数量
      ...columns.futuresPositionList[1],
      render: (text, record) => {
        return (
          <RenderText column={columns.futuresPositionList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{_t('1eac54fd1d834800a919')}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      ...columns.futuresPositionList[2],
      title: _t('assets.position.entryPrice'),
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.futuresPositionList[1]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.settleCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      ...columns.futuresPositionList[2],
      title: _t('refer.markPrice'),
      dataIndex: 'markPrice',
      render: (text, record) => {
        return (
          <RenderText column={h5Columns.futuresPositionList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.settleCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 未实现盈亏
      ...columns.futuresPositionList[3],
      render: (text, record) => {
        // 如果小于 0.00001，显示为 < + 0.00001
        let pnl = Number(record.unrealisedPnl) || 0;
        const Wrapper = pnl >= 0 ? GreenText : RedText;

        if (0 < pnl && pnl < 0.00001) {
          pnl = '< + 0.00001';
        } else if (-0.00001 < pnl && pnl < 0) {
          pnl = '< - 0.00001';
        } else {
          pnl = <NumberFormat isPositive={pnl > 0 || pnl < 0}>{pnl}</NumberFormat>;
        }
        const { from } = getPairInfo(record.symbol);
        return (
          <RenderText column={h5Columns.futuresPositionList[3]}>
            <div>
              <div>
                <Wrapper>{pnl}</Wrapper>
                <Coin>&nbsp;{from}</Coin>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Wrapper>
                  {typeof record.unrealisedRoePcnt === 'number' ||
                  typeof record.unrealisedRoePcnt === 'string' ? (
                    <NumberFormat isPositive options={{ style: 'percent' }}>
                      {record.unrealisedRoePcnt}
                    </NumberFormat>
                  ) : (
                    '--'
                  )}
                </Wrapper>
              </div>
            </div>
          </RenderText>
        );
      },
    },
  ],
  // 期权仓位
  marginOptionList: [
    {
      // 到期日
      ...columns.marginOptionList[1],
      render: (text, record) => (
        <RenderText column={h5Columns.marginOptionList[0]} record={record}>
          {formatTs(text)}
        </RenderText>
      ),
    },
    {
      ...columns.marginOptionList[2],
      render: (text, record) => (
        <RenderText column={h5Columns.marginOptionList[1]} record={record}>
          <div>
            <NumberFormat>{text}</NumberFormat>
            <span>&nbsp;{_t('1eac54fd1d834800a919')}</span>
          </div>
        </RenderText>
      ),
    },
  ],
  // 全仓杠杆仓位
  marginPositionList: [
    {
      // 负债
      ...columns.marginPositionList[1],
      render: (text, record) => (
        <RenderText column={h5Columns.marginPositionList[0]} record={record}>
          <div>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.token}</Coin>
          </div>
        </RenderText>
      ),
    },
    {
      // 资产
      ...columns.marginPositionList[2],
      render: (text, record) => (
        <RenderText column={h5Columns.marginPositionList[1]} record={record}>
          <div>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.token}</Coin>
          </div>
        </RenderText>
      ),
    },
  ],
  // 逐仓杠杆仓位
  marginIsolatedPositionList: [
    {
      // Base 币种负债 / 资产
      ...columns.marginIsolatedPositionList[1],
      render: (text, record) => (
        <RenderText column={h5Columns.marginIsolatedPositionList[0]} record={record}>
          <div>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.baseCurrency}</Coin>
            <span>&nbsp;/&nbsp;</span>
            <NumberFormat>{record.baseBalance}</NumberFormat>
            <Coin>&nbsp;{record.baseCurrency}</Coin>
          </div>
        </RenderText>
      ),
    },
    {
      // Quote 币种负债 / 资产
      ...columns.marginIsolatedPositionList[2],
      render: (text, record) => (
        <RenderText column={h5Columns.marginIsolatedPositionList[1]} record={record}>
          <div>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.quoteCurrency}</Coin>
            <span>&nbsp;/&nbsp;</span>
            <NumberFormat>{record.quoteBalance}</NumberFormat>
            <Coin>&nbsp;{record.quoteCurrency}</Coin>
          </div>
        </RenderText>
      ),
    },
  ],
  // 杠杆代币持仓信息
  leveragedTokensList: [
    {
      ...columns.leveragedTokensList[1],
      render: (text, record) => (
        <RenderText column={h5Columns.leveragedTokensList[0]} record={record}>
          <div>
            <NumberFormat>{text}</NumberFormat>
          </div>
        </RenderText>
      ),
    },
  ],
};

const H5ColCommonTitle = ({ title }) => {
  return <H5TableTitle title={title} />;
};

const h5ColTitle = {
  futuresPositionList: ({ record }) => {
    const Wrapper = Number(record.currentQty) >= 0 ? GreenText : RedText;
    const crossMode = record.crossMode ? _t('cross') : _t('isolated');
    const leverage = (
      <NumberFormat options={{ maximumFractionDigits: 2, minimumFractionDigits: 2 }}>
        {record.leverage}
      </NumberFormat>
    );
    return (
      <H5TableTitle
        title={<SymbolName symbol={record.symbol} />}
        subTitle={
          <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
            <Wrapper>
              {record.currentQty >= 0 ? _t('vnAf2EMB5Ncd4W6embc2jT') : _t('follow.short')}
            </Wrapper>
            <span>{crossMode}</span>
            <span>{leverage}x</span>
          </div>
        }
      />
    );
  },
  marginOptionList: ({ record }) => <H5ColCommonTitle title={record.token} />,
  marginPositionList: ({ record }) => <H5ColCommonTitle title={record.token} />,
  marginIsolatedPositionList: ({ record }) => {
    const base = record.baseCurrency;
    const quote = record.quoteCurrency;
    return <H5ColCommonTitle title={`${base} / ${quote}`} />;
  },
  leveragedTokensList: ({ record }) => {
    const token = record.token;
    return <H5ColCommonTitle title={token} />;
  },
};

const SubLine = styled.div`
  display: inline-flex;
  font-size: 14px;
  margin-top: 4px;
  font-weight: 500;
  gap: 4px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
