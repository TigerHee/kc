/**
 * Owner: mike@kupotech.com
 */
import React, { useMemo } from 'react';
import VirtualTable from '@kux/mui/VirtualTable';
import { _t, _tHTML } from 'Bot/utils/lang';
import Radio from '@mui/Radio';
import { Flex, Text } from 'Bot/components/Widgets';
import CoinCodeToName from '@/components/CoinCodeToName';
import { formatNumber } from 'Bot/helper';
import { ChangeRate } from 'Bot/components/ColorText';
import { useSelector } from 'dva';
import styled from '@emotion/styled';
import { isRTLLanguage } from 'src/utils/langTools';

const MVirtualTable = styled(VirtualTable)`
  thead th {
    padding-top: 8px;
    padding-bottom: 0;
    span {
      font-size: 12px;
    }

    &:nth-of-type(3) {
      padding-right: 12px;
    }
  }
  [dir='rtl'] & {
    thead th:nth-of-type(2) {
       /* @noflip */
      text-align: right!important;
    }
  }
  .KuxTable-virtual-table-cell {
    overflow: hidden;
  }
  .KuxTable-virtual-table-row-cell-first {
    /* @noflip */
    padding-left: 12px;
  }
  .KuxTable-virtual-table-row-cell-last {
    /* @noflip */
    padding-right: 12px;
  }
`;
const MRadio = styled(Radio)`
  margin: 0;
  /* @noflip */
  margin-right: 6px;
  .KuxRadio-inner {
    width: 16px;
    height: 16px;
    &:after {
      width: 8px;
      height: 8px;
      right: 0;
      left: 0;
      bottom: 0;
      top: 0;
      margin: auto;
    }
  }
`;
const ReactiveRadio = ({ baseCurrency, reducerName }) => {
  const createTargetCoins = useSelector((state) => state.smarttrade[reducerName]);
  const checked = createTargetCoins.includes(baseCurrency);
  return <MRadio size="small" checked={checked} />;
};
const columnsFactory = (reducerName) => [
  {
    title: _t('gridwidget12'),
    dataIndex: 'baseCurrency',
    key: 'baseCurrency',
    align: 'left',
    sorter: (a, b) => (a.baseCurrency < b.baseCurrency ? -1 : 1),
    render: (baseCurrency, row, index) => (
      <Flex vc cursor>
        <ReactiveRadio baseCurrency={baseCurrency} reducerName={reducerName} />
        <Text color="text" fs={12} fw={500}>
          <CoinCodeToName coin={baseCurrency} />
        </Text>
      </Flex>
    ),
  },
  {
    title: _t('gridwidget13'),
    dataIndex: 'lastTradedPrice',
    key: 'lastTradedPrice',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.lastTradedPrice - b.lastTradedPrice,
    align: 'right',
    render: (lastTradedPrice, row, index) => (
      <Text color="text" fs={12} fw={500}>
        {lastTradedPrice ? formatNumber(lastTradedPrice) : '--'}
      </Text>
    ),
  },
  {
    title: _t('gridwidget14'),
    dataIndex: 'changeRate',
    key: 'changeRate',
    align: 'right',
    sorter: (a, b) => a.changeRate - b.changeRate,
    render: (changeRate) => {
      return <ChangeRate value={changeRate} fw={500} fs={12} />;
    },
  },
];
export default ({ dataSource, onselect, y, reducerName, ...rest }) => {
  const columns = useMemo(() => columnsFactory(reducerName), []);
  return (
    <MVirtualTable
      onRowClick={(record) => onselect(record.baseCurrency)}
      headerBorder={false}
      size="small"
      dataSource={dataSource}
      columns={columns}
      rowKey="baseCurrency"
      bordered={false}
      headerType="transparent"
      scroll={{ y }}
      rowHeight={44}
      direction={isRTLLanguage() ? 'rtl' : 'ltr'}
      {...rest}
    />
  );
};
