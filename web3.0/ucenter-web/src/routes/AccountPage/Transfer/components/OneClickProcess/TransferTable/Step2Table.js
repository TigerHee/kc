/**
 * Owner: eli@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import NumberFormat from 'components/common/NumberFormat';
import { useSelector } from 'react-redux';
import { isEmpty } from 'src/helper';
import { _t } from 'src/tools/i18n';
import CommonTable, { Coin, GreenText, RedText, TableRightColumn } from '../components/CommonTable';
import H5Table, { H5TableContent, H5TableTitle, RenderText } from '../components/H5CommonTable';
import { formatTs, getNumberWrapper, getPairInfo, TimeBox } from './columns';

export default function Step2Table({ tabs = [], curTab = {}, data = {}, onRow }) {
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
            dataSource={data[tab.value]}
            pagination={{ total: h5Total }}
            H5TableTitle={h5ColTitle[key]}
            curTab={curTab}
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
// PC 字段设置
const columns = {
  cloudxList: [
    {
      title: _t('table.header.label.createdAt'),
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: '16%',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
    {
      title: _t('66a34bbafcb54000a5bf'),
      dataIndex: 'cloudxType',
      key: 'cloudxType',
      width: '16%',
    },
    {
      title: _t('side'),
      dataIndex: 'side',
      key: 'side',
      width: '16%',
      render: (text) => {
        let word = '--';
        if (text === 'long') word = _t('vnAf2EMB5Ncd4W6embc2jT');
        else if (text === 'short') word = _t('follow.short');
        let Wrapper = ({ children }) => <span>{children}</span>;
        if (text === 'long') Wrapper = GreenText;
        else if (text === 'short') Wrapper = RedText;
        return <Wrapper>{word}</Wrapper>;
      },
    },
    {
      title: _t('mkTzC82devTbRDQkHg8eXS'),
      dataIndex: 'symbolName',
      key: 'symbolName',
      width: '16%',
      render: (text, record) => {
        // 最大宽度 120, 超出部分省略号
        return (
          <div
            style={{
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: <TableRightColumn>{_t('follow.investment')}</TableRightColumn>,
      dataIndex: 'investAmount',
      key: 'investAmount',
      width: '16%',
      render: (text, record) => {
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.currency}</Coin>
          </TableRightColumn>
        );
      },
    },
    {
      title: <TableRightColumn>{_t('78cdad394db84800ab4b')}</TableRightColumn>,
      dataIndex: 'profitAmount',
      key: 'profitAmount',
      width: '16%',
      render: (text, record) => {
        const { from } = getPairInfo(record.symbol);
        const Wrapper = getNumberWrapper(text);
        return (
          <Wrapper>
            <TableRightColumn>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{from}</Coin>
            </TableRightColumn>
          </Wrapper>
        );
      },
    },
  ],
  copyTradingList: [
    {
      title: _t('d7db595077044000a8ae'),
      dataIndex: 'trader',
      key: 'trader',
    },
    {
      title: _t('1ca954bb4d1b4800a785'),
      dataIndex: 'profitAmount',
      key: 'profitAmount',
      render: (text, record) => {
        const Wrapper = getNumberWrapper(text);
        return (
          <Wrapper>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.quoteCurrency}</Coin>
          </Wrapper>
        );
      },
    },
    {
      title: _t('794373c6a1a44800adc1'),
      dataIndex: 'followerAmount',
      key: 'followerAmount',
      render: (text, record) => {
        return (
          <div>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.quoteCurrency}</Coin>
          </div>
        );
      },
    },
    {
      title: _t('follow.sharerate'),
      dataIndex: 'profitRate',
      key: 'profitRate',
      render: (text) => {
        return typeof text === 'number' || typeof text === 'string' ? (
          <NumberFormat
            options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
          >
            {text}
          </NumberFormat>
        ) : (
          '--'
        );
      },
    },
    {
      title: _t('1c2e48645f464000a387'),
      dataIndex: 'followerTime',
      key: 'followerTime',
      render: (text) => {
        return <TimeBox timestamp={text} />;
      },
    },
  ],
  leadTrading: [
    {
      title: _t('88914742e3414000a0ca'),
      dataIndex: 'nickName',
      key: 'nickName',
    },
    {
      title: _t('ae471fb6eb754800afb8'),
      dataIndex: 'currentCopyNum',
      key: 'currentCopyNum',
    },
    {
      title: <TableRightColumn>{_t('082856d017504800ab20')}</TableRightColumn>,
      dataIndex: 'followerTotalAsset',
      key: 'followerTotalAsset',
      render: (text, record) => {
        return (
          <TableRightColumn>
            <NumberFormat>{text}</NumberFormat>
            <Coin>&nbsp;{record.quoteCurrency}</Coin>
          </TableRightColumn>
        );
      },
    },
    {
      title: _t('c35ce71a63f24000abd3'),
      dataIndex: 'totalPnl',
      key: 'totalPnl',
      render: (text, record) => {
        if (!text || !record.followerTotalAsset) return '--';
        const Wrapper = getNumberWrapper(text);
        return (
          <Wrapper>
            <NumberFormat isPositive={text > 0 || text < 0}>{text}</NumberFormat>
          </Wrapper>
        );
      },
    },
  ],
  earnList: [
    {
      title: _t('uGjtESqp2R2G2ogHKaJeXZ'),
      dataIndex: 'categoryText',
      key: 'categoryText',
      width: '33.3%',
    },
    {
      title: _t('qCtpCMRwSpHG73GhHUkTF8'),
      dataIndex: 'investCurrency',
      key: 'investCurrency',
      width: '33.3%',
      render: (text) => {
        return isEmpty(text) ? '--' : <CoinIcon currency={text} />;
      },
    },
    {
      title: <TableRightColumn>{_t('aa3581f430fb4000a784')}</TableRightColumn>,
      dataIndex: 'investAmount',
      key: 'investAmount',
      width: '33.3%',
      render: (text, record) => {
        return (
          <TableRightColumn>
            {isEmpty(text) ? (
              '--'
            ) : (
              <>
                <NumberFormat>{text}</NumberFormat>
                <Coin>&nbsp;{record.investCurrency}</Coin>
              </>
            )}
          </TableRightColumn>
        );
      },
    },
  ],
};

const h5Columns = {
  // 机器人
  cloudxList: [
    {
      // 创建时间
      ...columns.cloudxList[0],
      render: (text, record) => {
        return (
          <RenderText column={columns.cloudxList[0]} record={record}>
            {formatTs(text)}
          </RenderText>
        );
      },
    },
    {
      // 投资额
      ...columns.cloudxList[4],
      render: (text, record) => {
        return (
          <RenderText column={columns.cloudxList[4]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.currency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 总利润
      ...columns.cloudxList[5],
      render: (text, record) => {
        const Wrapper = getNumberWrapper(text);
        return (
          <RenderText column={columns.cloudxList[5]} record={record}>
            <Wrapper>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.currency}</Coin>
            </Wrapper>
          </RenderText>
        );
      },
    },
  ],
  // 跟单
  copyTradingList: [
    {
      // 跟单总收益
      ...columns.copyTradingList[1],
      render: (text, record) => {
        const Wrapper = getNumberWrapper(text);
        return (
          <RenderText column={columns.copyTradingList[1]} record={record}>
            <Wrapper>
              <NumberFormat isPositive={text > 0 || text < 0}>{text}</NumberFormat>
              <Coin>&nbsp;{record.quoteCurrency}</Coin>
            </Wrapper>
          </RenderText>
        );
      },
    },
    {
      // 跟单总金额
      ...columns.copyTradingList[2],
      render: (text, record) => {
        return (
          <RenderText column={columns.copyTradingList[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.quoteCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 分润比例
      ...columns.copyTradingList[3],
      render: (text) => {
        return (
          <RenderText column={columns.copyTradingList[3]}>
            {typeof text === 'number' || typeof text === 'string' ? (
              <NumberFormat
                options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
              >
                {text}
              </NumberFormat>
            ) : (
              '--'
            )}
          </RenderText>
        );
      },
    },
    {
      // 跟单时间
      ...columns.copyTradingList[4],
      render: (text) => {
        return <RenderText column={columns.copyTradingList[4]}>{formatTs(text)}</RenderText>;
      },
    },
  ],
  // 带单
  leadTrading: [
    {
      // 带单总盈亏
      ...columns.leadTrading[3],
      render: (text, record) => {
        const Wrapper = text > 0 ? GreenText : RedText;
        return (
          <RenderText column={columns.leadTrading[3]} record={record}>
            <div>
              <Wrapper>
                <NumberFormat isPositive={text > 0 || text < 0}>{text}</NumberFormat>
              </Wrapper>
              <Coin>&nbsp;{record.quoteCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 带单规模
      ...columns.leadTrading[2],
      render: (text, record) => {
        return (
          <RenderText column={columns.leadTrading[2]} record={record}>
            <div>
              <NumberFormat>{text}</NumberFormat>
              <Coin>&nbsp;{record.quoteCurrency}</Coin>
            </div>
          </RenderText>
        );
      },
    },
    {
      // 跟单人数
      ...columns.leadTrading[1],
      render: (text, record) => {
        return (
          <RenderText column={columns.leadTrading[1]} record={record}>
            {text}
          </RenderText>
        );
      },
    },
  ],
  // 理财
  earnList: [
    {
      // 币种
      ...columns.earnList[1],
      render: (text, record) => {
        return (
          <RenderText column={columns.earnList[1]} record={record}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {isEmpty(text) ? '--' : <CoinIcon currency={text} />}
            </div>
          </RenderText>
        );
      },
    },
  ],
};

const h5ColTitle = {
  cloudxList: ({ record }) => {
    const sideMap = {
      long: <GreenText>{_t('vnAf2EMB5Ncd4W6embc2jT')}</GreenText>,
      short: <RedText>{_t('follow.short')}</RedText>,
    };
    return (
      <H5TableTitle
        title={`${record.symbolName} ${record.cloudxType}`}
        subTitle={sideMap[record.side] || ''}
      />
    );
  },
  copyTradingList: ({ record }) => {
    return (
      <H5TableTitle
        title={
          <Avatar>
            {record.headImage ? <img src={record.headImage} alt="avatar" /> : null}
            {record.trader}
          </Avatar>
        }
      />
    );
  },
  leadTrading: ({ record }) => {
    return <H5TableTitle title={record.nickName} />;
  },
  earnList: ({ record }) => {
    return (
      <H5TableTitle
        title={
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {record.categoryText}
          </div>
        }
      />
    );
  },
};

const Avatar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  img {
    width: 17px;
    height: 17px;
    border-radius: 50%;
  }
`;

const CoinIcon = ({ currency, style }) => {
  const categories = useSelector((state) => state.categories);
  const { iconUrl, currencyName } = categories[currency] || {};
  if (iconUrl) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <img
          src={iconUrl}
          alt={currency}
          width={24}
          height={24}
          style={{ borderRadius: '50%', ...style }}
        />
        {currencyName || currency}
      </div>
    );
  }
  return currencyName || currency;
};
