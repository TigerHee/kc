/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import classnames from 'classnames';
import { ButtonWeight } from '@mui/Button';
import Dropdown, { DropdownOverlayClose } from '@mui/Dropdown';
import { useTheme } from '@emotion/react';
import { RightOutlined } from '@kux/icons';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import useCompareAssets from './hooks/useCompareAssets';
import { getSpotDataSource } from './util';
import { topicName } from '@/pages/Assets/config';
import CoinPrecision from '@/components/CoinPrecision';
import { execMaybeFnOrParam } from '@/utils/tools';
import useWorkerSubscribe from '@/hooks/useWorkerSubscribe';
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
  CICMoreOutlined,
  MWrap,
} from './style';

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
const Operation = ({ record, showDropDownOper }) => {
  if (showDropDownOper) {
    return <OperationDropdown currency={record.currency} />;
  }
  return (
    <div>
      <ButtonWeight
        variant="text"
        mr={12}
        type="brandGreen"
        onClick={() => jump.deposit(record.currency)}
      >
        {_t('deposit')}
      </ButtonWeight>
      <ButtonWeight
        variant="text"
        mr={12}
        type="brandGreen"
        onClick={jump.useTransfer({ currency: record.currency })}
      >
        {_t('transfer.s')}
      </ButtonWeight>
      <ButtonWeight variant="text" type="brandGreen" onClick={() => jump.withdraw(record.currency)}>
        {_t('withdraw')}
      </ButtonWeight>
    </div>
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
        <div
          className="dropdown-item"
          key={item.symbolCode}
          onClick={() => changeSymbol(item.symbolCode)}
        >
          {item.symbolName}
        </div>
      ))}
    </DropdownExtend.List>
  );
};
/**
 * @description: 操作下拉
 * @param {*} React
 * @return {*}
 */
const OperationDropdown = React.memo(({ currency }) => {
  return (
    <Dropdown
      trigger="click"
      disablePortal={false}
      holdDropdown
      height="auto"
      overlay={
        <DropdownExtend.List>
          <div className="dropdown-item" onClick={() => jump.deposit(currency)}>
            {_t('deposit')}
          </div>
          <div className="dropdown-item" onClick={jump.useTransfer({ currency })}>
            {_t('transfer.s')}
          </div>
          <div className="dropdown-item" onClick={() => jump.withdraw(currency)}>
            {_t('withdraw')}
          </div>
        </DropdownExtend.List>
      }
      placement="bottom-start"
    >
      <CICMoreOutlined size={16} />
    </Dropdown>
  );
});

const columnsCFG = (colors, { assetsSorter, showDropDownOper, isRtl }) => [
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
          disablePortal={false}
          trigger="click"
          overlay={(conf) => <Overlay {...conf} subLists={record.subLists} />}
          placement="bottom-end"
        >
          <HasSubLists>
            <SymbolIcon currency={currency} size={20} />
            <RightOutlined color={colors.icon} size={16} />
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
    render: renderAmount(true),
    align: 'left',
  },
  {
    title: _t('bv4u5WW4GNncSY7BfkJmus'), // 可用
    width: '20%',
    dataIndex: 'availableBalance',
    key: 'availableBalance',
    sorter: assetsSorter('totalBalance'),
    render: renderAmount(false),
    align: 'left',
  },
  {
    title: _t('tJR9VhSemyRNuDEZZBaxJC'), // 冻结
    width: '20%',
    dataIndex: 'holdBalance',
    key: 'holdBalance',
    sorter: assetsSorter('holdBalance'),
    render: renderAmount(false),
    align: 'left',
  },
  {
    title: _t('margin.entrustList.title.action'), // 操作
    width: showDropDownOper ? '8%' : '20%',
    align: 'right',
    render: (_, record) => {
      return <Operation record={record} showDropDownOper={showDropDownOper} />;
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
  useWorkerSubscribe(topicName, true);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const screen = React.useContext(WrapperContext);
  const { isLargeAssets, assetsSorter } = useCompareAssets();
  const showDropDownOper = screen === 'lg1';
  const isRtl = isRTLLanguage();
  const columns = React.useMemo(() => {
    return columnsCFG(colors, { assetsSorter, showDropDownOper, isRtl });
  }, [colors, assetsSorter, showDropDownOper]);
  const isLogin = useSelector((state) => state.user.isLogin);
  // 资产列表
  const tradeMap = useSelector((state) => state.user_assets.tradeMap, shallowEqual);
  // 所有交易对列表
  const allSymbolsArr = useSelector((state) => state.symbols.symbols, shallowEqual);

  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  // 用户小额资产配置
  const smallExchangeConfig = useSelector((state) => state.user_assets.smallExchangeConfig);
  const isHideSmallAssets = useSelector((state) => state.fund.isHideSmallAssets);

  React.useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'user_assets/getSmallExchangeConfig',
      });
    }
  }, [isLogin]);

  const dataSource = React.useMemo(
    () =>
      getSpotDataSource({
        tradeMap,
        currentSymbol,
        allSymbolsArr,
        smallExchangeConfig,
        isHideSmallAssets,
        isLargeAssets,
      }),
    [tradeMap, allSymbolsArr, currentSymbol, smallExchangeConfig, isHideSmallAssets, isLargeAssets],
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
