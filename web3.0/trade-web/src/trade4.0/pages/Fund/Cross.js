/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import classnames from 'classnames';
import { noop } from 'lodash';
import Dropdown, { DropdownOverlayClose } from '@mui/Dropdown';
import { useTheme } from '@emotion/react';
import { RightOutlined } from '@kux/icons';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import useWorkerSubscribe from '@/hooks/useWorkerSubscribe';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { getCrossDataSource } from './util';
import CoinPrecision from '@/components/CoinPrecision';
import { execMaybeFnOrParam } from '@/utils/tools';
import { isRTLLanguage } from 'src/utils/langTools';
import { DropdownExtend } from './components/FundSelector/style';
import { WrapperContext, jump } from './config';
import { _t } from 'utils/lang';
import {
  Text,
  Flex,
  SymbolIcon,
  CustomTable,
  CoinCurrency,
  HasSubLists,
  MWrap,
  CICMoreOutlined,
  StyledButtonWeight as ButtonWeight,
} from './style';
import useCompareAssets from './hooks/useCompareAssets';

const renderAmount =
  (showCoin = true) =>
  (value, record) => {
    return (
      <Text fs="12" as="div">
        <Text color="text" as="div">
          <CoinPrecision coin={record.currency} value={value} fixZero />
        </Text>
        {showCoin && <CoinCurrency value={value} coin={record.currency} padZero showType={2} />}
      </Text>
    );
  };

/**
 * @description: 币种下拉
 * @param {*} subLists
 * @return {*}
 */
const Overlay = ({ subLists, onClose }) => {
  const dispatch = useDispatch();
  const changeSymbol = (symbolCode) => {
    dispatch({
      type: '$tradeKline/routeToSymbol',
      payload: { symbol: symbolCode },
    });
    onClose();
  };
  return (
    <DropdownExtend.List>
      {subLists.map((item) => (
        <div className="dropdown-item" key={item.symbol} onClick={() => changeSymbol(item.symbol)}>
          {item.symbolName?.replace('-', '/')}
        </div>
      ))}
    </DropdownExtend.List>
  );
};
const Operation = ({ record, showDropDownOper }) => {
  const dispatch = useDispatch();
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const { currency } = record;

  const openMarginModal = useCallback(
    (modalType) => {
      const { code, baseCurrency, quoteCurrency } = currentSymbolInfo;
      let tag = `${currency}-USDT`;
      if ([baseCurrency, quoteCurrency].includes(currency)) {
        tag = code;
      } else if (currency === 'USDT') {
        tag = 'BTC-USDT';
      }
      dispatch({
        type: 'marginMeta/updateMarginModalConfig',
        payload: {
          tag,
          currency,
          modalType,
          open: true,
        },
      });
    },
    [currency, currentSymbolInfo],
  );

  const operations = [
    {
      key: 'borrow',
      label: _t('margin.borrow'),
      onClick: openMarginModal.bind(this, 0),
    },
    {
      key: 'repay',
      label: _t('margin.repay'),
      onClick: openMarginModal.bind(this, 1),
    },
    {
      key: 'transfer',
      label: _t('transfer.s'),
      onClick: jump.useTransfer({ currency }),
    },
  ];

  if (showDropDownOper) {
    return (
      <Dropdown
        holdDropdown
        height="auto"
        trigger="click"
        disablePortal={false}
        overlay={
          <DropdownExtend.List>
            {operations.map(({ key, disabled, label, onClick }) => {
              return (
                <div key={key} className="dropdown-item" onClick={disabled ? noop : onClick}>
                  {label}
                </div>
              );
            })}
          </DropdownExtend.List>
        }
        placement="bottom-start"
      >
        <CICMoreOutlined size={16} />
      </Dropdown>
    );
  }
  return (
    <div>
      {operations.map(({ key, disabled, label, onClick }, index) => {
        return (
          <ButtonWeight
            key={key}
            variant="text"
            type="brandGreen"
            onClick={onClick}
            disabled={disabled}
            {...(index > 0 ? { ml: 12 } : null)}
          >
            {label}
          </ButtonWeight>
        );
      })}
    </div>
  );
};
const columnsCFG = (colors, { assetsSorter, screen, isRtl }) => [
  {
    title: _t('iUzxtjG9HVCobyW99bd1oe'), // 币种
    width: 100,
    dataIndex: 'currency',
    key: 'currency',
    align: 'left',
    render: (currency, record) => {
      if (!record.subLists) {
        return <SymbolIcon currency={currency} size={20} />;
      }
      return (
        <DropdownOverlayClose
          trigger="click"
          disablePortal={false}
          overlay={(conf) => <Overlay {...conf} subLists={record.subLists} />}
          placement="bottom-end"
        >
          <HasSubLists>
            <SymbolIcon currency={currency} size={20} />
            <RightOutlined color={colors.icon40} size={16} />
          </HasSubLists>
        </DropdownOverlayClose>
      );
    },
  },
  {
    title: _t('margin.total'), // 总计
    width: '20%',
    dataIndex: 'totalBalance',
    key: 'totalBalance',
    sorter: assetsSorter('totalBalance'),
    align: 'left',
    render: renderAmount(),
  },
  {
    title: _t('bv4u5WW4GNncSY7BfkJmus'), // 可用
    width: '20%',
    dataIndex: 'availableBalance',
    key: 'availableBalance',
    sorter: assetsSorter('availableBalance'),
    align: 'left',
    render: renderAmount(false),
  },
  {
    title: _t('tJR9VhSemyRNuDEZZBaxJC'), // 冻结
    width: '20%',
    dataIndex: 'holdBalance',
    key: 'holdBalance',
    sorter: assetsSorter('holdBalance'),
    align: 'left',
    render: renderAmount(false),
  },
  {
    title: _t('margin.debt.amount'), // 负债
    width: '20%',
    dataIndex: 'liability',
    key: 'liability',
    sorter: assetsSorter('liability'),
    align: 'left',
    render: renderAmount(false),
  },
  {
    title: _t('margin.entrustList.title.action'), // 操作
    width: screen !== 'lg2' ? 80 : 150,
    align: 'right',
    render: (_, record) => {
      return <Operation record={record} showDropDownOper={screen !== 'lg2'} />;
    },
  },
];
const ModileItem = ({ record, screen, columns }) => {
  const columnsHere = columns.slice(1, -1);
  return (
    <MWrap.box screen={screen}>
      <Flex vc sb>
        {!record.subLists ? (
          <SymbolIcon currency={record.currency} size={20} fontSize={14} />
        ) : (
          <DropdownOverlayClose
            disablePortal={false}
            trigger="click"
            overlay={(conf) => <Overlay {...conf} subLists={record.subLists} />}
            placement="bottom-end"
          >
            <HasSubLists>
              <SymbolIcon currency={record.currency} size={20} fontSize={14} />
              <RightOutlined size={16} />
            </HasSubLists>
          </DropdownOverlayClose>
        )}

        <Operation record={record} showDropDownOper={screen === 'sm' || screen === 'md'} />
      </Flex>
      {columnsHere.map((item) => {
        return (
          <MWrap.item
            className={classnames('', {
              oneCloumn: screen === 'sm' || screen === 'md',
              threeCloumn: screen === 'lg',
              fourCloumn: screen === 'lg1',
            })}
            key={item.key}
          >
            <Text color="text40" fs="12" className="label">
              {item.title}
            </Text>
            <div className="valueWrapper">
              {execMaybeFnOrParam(item.render, record[item.key], record)}
            </div>
          </MWrap.item>
        );
      })}
    </MWrap.box>
  );
};
/**
 * @description: 小屏幕样式
 * @param {*} React
 * @return {*}
 */
const MobileMode = React.memo(({ dataSource = [], columns }) => {
  const screen = React.useContext(WrapperContext);
  return dataSource.map((record) => (
    <ModileItem key={record.currency} record={record} screen={screen} columns={columns} />
  ));
});
export default React.memo(({ height }) => {
  const { colors } = useTheme();
  const screen = React.useContext(WrapperContext);
  useWorkerSubscribe('/margin/position', true);
  useWorkerSubscribe('/margin/account', true);
  const { assetsSorter } = useCompareAssets();
  const isRtl = isRTLLanguage();
  const columns = React.useMemo(
    () => columnsCFG(colors, { assetsSorter, screen, isRtl }),
    [colors, screen, isRtl],
  );
  const { marginSymbolsMap } = useSelector((state) => state.symbols, shallowEqual);
  // marginMap的数据优先级高于margin的
  const { margin: marginAssets, marginMap: marginAssetsMap } = useSelector(
    (state) => state.user_assets,
    shallowEqual,
  );
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const isLiabilityOnly = useSelector((state) => state.fund.isLiabilityOnly);

  const dataSource = React.useMemo(
    () =>
      getCrossDataSource({
        currentSymbol,
        marginSymbolsMap,
        marginAssetsMap,
        marginAssets,
        isLiabilityOnly,
      }),
    [currentSymbol, marginSymbolsMap, marginAssetsMap, marginAssets, isLiabilityOnly],
  );
  if (['lg1', 'lg2'].includes(screen)) {
    return (
      <CustomTable
        headerBorder
        dataSource={dataSource}
        columns={columns}
        rowKey="currency"
        bordered
        loading={false}
        size="small"
        scroll={{ y: height }}
      />
    );
  }
  return <MobileMode dataSource={dataSource} columns={columns} />;
});
