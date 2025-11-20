/**
 * Owner: mike@kupotech.com
 */
import React, { useContext, useMemo, useEffect, useCallback, Fragment } from 'react';
import classnames from 'classnames';
import { isNil, noop } from 'lodash';
import { useTheme } from '@emotion/react';
import { RightOutlined } from '@kux/icons';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import Dropdown from '@mui/Dropdown';
import CoinPrecision from '@/components/CoinPrecision';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import PositionStatus from '@/components/Margin/PositionStatus';
import usePolling from '@/hooks/usePolling';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import useWorkerSubscribe, { getTopic } from '@/hooks/useWorkerSubscribe';
import { STATUS } from '@/meta/margin';
import { ACCOUNT_CODE, ISOLATED } from '@/meta/const';
import { event } from '@/utils/event';
import {
  checkIsSupportClosePosition,
  checkIsSupportCancelClosePosition,
} from '@/pages/Portal/ClosePositionModal/utils';
import { normalizeNumber } from 'src/helper';
import { isRTLLanguage } from 'src/utils/langTools';
import { _t } from 'src/utils/lang';
import { execMaybeFnOrParam } from '@/utils/tools';
import { DropdownExtend } from './components/FundSelector/style';
import { getISODataSource } from './util';
import { WrapperContext, jump } from './config';
import useCompareAssets from './hooks/useCompareAssets';
import { sensorFunc } from '@/hooks/useSensorFunc';

import {
  Text,
  Flex,
  SymbolIcon,
  CustomTable,
  HasSubLists,
  MWrap,
  CICMoreOutlined,
  StyledButtonWeight as ButtonWeight,
  OperationWrapper,
} from './style';

const useTransfer = (tag) => {
  const currency = tag.split('-').pop();
  return jump.useTransfer({
    currency,
    initDict: [[ACCOUNT_CODE.TRADE], [ACCOUNT_CODE.ISOLATED, tag]],
  });
};

const renderAmount = (key) => {
  return (_, record) => {
    return (
      <Text fs="12" as="div" color="text">
        <div style={{ marginBottom: 2 }}>
          <CoinPrecision coin={record.baseAsset?.currency} value={record.baseAsset?.[key]} />
        </div>
        <CoinPrecision coin={record.quoteAsset?.currency} value={record.quoteAsset?.[key]} />
      </Text>
    );
  };
};
/**
 * @description: 负债率和爆仓价会合并显示在一列
 */
const MergeColumnRender = {
  // 这是函数
  liabilityRate: (_, { tag, status, liabilityRate }) => {
    return (
      <PositionStatus
        disabled
        symbol={tag}
        status={status}
        showDashboard={false}
        liabilityRate={liabilityRate}
      />
    );
  },
  // 这是组件
  liquidationPrice: ({ record }) => {
    const { status, quoteAsset, liquidationPrice } = record;
    const { isHideLiquidationPrice } = STATUS[ACCOUNT_CODE.ISOLATED][status] || {};

    const showCountPlaceholder =
      isHideLiquidationPrice || +liquidationPrice < 0 || isNil(liquidationPrice);

    return (
      <Text fs={12} color={showCountPlaceholder ? 'text30' : 'complementary'} as="div">
        {!showCountPlaceholder ? normalizeNumber(liquidationPrice, 12) : '--'}
        {` ${quoteAsset.currency}`}
      </Text>
    );
  },
};
const SymbolRender = ({ record = {} }) => {
  const { hasArrow, tag } = record;
  const { colors } = useTheme();
  const changeSymbolHandler = jump.useChangeSymbol(tag);
  const symbolName = (
    <span style={{ fontSize: 12 }}>
      <SymbolCodeToName code={tag} />
    </span>
  );
  if (!hasArrow) {
    return symbolName;
  }
  return (
    <HasSubLists onClick={changeSymbolHandler}>
      {symbolName}
      <RightOutlined color={colors.icon40} size={14} />
    </HasSubLists>
  );
};

const TotalBalance = ({ record, style }) => {
  const screen = useContext(WrapperContext);
  const isShowSymbolIcon = ['lg', 'lg1', 'lg2', 'lg3'].includes(screen);
  return (
    <Text fs={12} color="text" as="div">
      <Flex vc style={style}>
        {isShowSymbolIcon && (
          <SymbolIcon showName={false} currency={record.baseAsset?.currency} size={16} mr={6} />
        )}

        <CoinPrecision coin={record.baseAsset?.currency} value={record.baseAsset?.totalBalance} />
      </Flex>
      <Flex vc style={{ marginTop: 2, ...style }}>
        {isShowSymbolIcon && (
          <SymbolIcon showName={false} currency={record.quoteAsset?.currency} size={16} mr={6} />
        )}

        <CoinPrecision coin={record.quoteAsset?.currency} value={record.quoteAsset?.totalBalance} />
      </Flex>
    </Text>
  );
};

const Operation = ({ record, showDropDownOper, showPartDropDownOper }) => {
  const dispatch = useDispatch();

  const isSupportClosePosition = checkIsSupportClosePosition(record?.status);
  const isSupportCancelClosePosition = checkIsSupportCancelClosePosition(record);

  const openClosePositionModal = useCallback(() => {
    dispatch({
      type: 'isolated/updateClosePositionModalConfig',
      payload: {
        visible: true,
        ...record,
      },
    });
    sensorFunc(['assetDisplayArea', 'closePosition']);
  }, [dispatch, record, sensorFunc]);

  const openMarginModal = useCallback(
    (modalType) => {
      dispatch({
        type: 'marginMeta/updateMarginModalConfig',
        payload: {
          modalType,
          open: true,
          tag: record.tag,
        },
      });
    },
    [dispatch, record.tag],
  );

  const openCancelClosePositionModal = useCallback(() => {
    dispatch({
      type: 'isolated/updateCancelClosePositionModalConfig',
      payload: {
        visible: true,
        ...record,
      },
    });
    sensorFunc(['assetDisplayArea', 'canelClosePosition']);
  }, [dispatch, record, sensorFunc]);

  const common = [
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
      onClick: useTransfer(record.tag),
    },
  ];

  /**
   * 特殊的展示逻辑
   * 一键平仓优先于取消平仓
   * 如果都没有 展示 禁用的 一键平仓起占位作用
   */
  const closes = useMemo(() => {
    const closePositions = [];

    if (isSupportClosePosition) {
      closePositions.push({
        key: 'closePosition',
        onClick: openClosePositionModal,
        disabled: false,
        label: _t('vgzWfdsGbtgNLJrDpz1v4P'),
      });
    } else if (isSupportCancelClosePosition) {
      closePositions.push({
        key: 'cancelClosePosition',
        onClick: openCancelClosePositionModal,
        label: _t('39KvvPYFBnvWh6j94CgdqD'),
        disabled: false,
      });
    } else {
      closePositions.push({
        key: 'closePosition',
        onClick: openClosePositionModal,
        disabled: true,
        label: _t('vgzWfdsGbtgNLJrDpz1v4P'),
      });
    }

    return closePositions;
  }, [
    isSupportCancelClosePosition,
    isSupportClosePosition,
    openCancelClosePositionModal,
    openClosePositionModal,
  ]);

  const operations = [...common, ...closes];

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
                <div
                  key={key}
                  onClick={disabled ? noop : onClick}
                  className={classnames('dropdown-item', { disabled: !!disabled })}
                >
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
  } else if (showPartDropDownOper) {
    return (
      <OperationWrapper>
        {operations?.slice(0, 2)?.map(({ key, disabled, label, onClick }, index) => {
          return (
            <ButtonWeight
              key={key}
              variant="text"
              type="brandGreen"
              onClick={onClick}
              disabled={disabled}
              mr={12}
            >
              {label}
            </ButtonWeight>
          );
        })}
        <Dropdown
          holdDropdown
          height="auto"
          trigger="click"
          disablePortal={false}
          overlay={
            <DropdownExtend.List>
              {operations
                ?.slice(2, operations?.length + 1)
                ?.map(({ key, disabled, label, onClick }) => {
                  return (
                    <div
                      key={key}
                      onClick={disabled ? noop : onClick}
                      className={classnames('dropdown-item', { disabled: !!disabled })}
                    >
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
      </OperationWrapper>
    );
  }
  return (
    <OperationWrapper>
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
    </OperationWrapper>
  );
};
const columnsCFG = ({ assetsSorter, screen, isRtl }) => {
  return [
    {
      title: _t('orders.col.symbol'), // 交易对
      width: 130,
      dataIndex: 'tag',
      key: 'tag',
      align: 'left',
      render: (_, record) => {
        return <SymbolRender record={record} />;
      },
    },
    {
      title: _t('margin.total'), // 总计
      width: '15%',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
      sorter: assetsSorter('totalBalance'),
      align: 'left',
      render: (_, record, conf) => {
        return <TotalBalance record={record} style={conf?.style} />;
      },
    },
    {
      title: _t('bv4u5WW4GNncSY7BfkJmus'), // 可用
      width: '15%',
      dataIndex: 'availableBalance',
      key: 'availableBalance',
      sorter: assetsSorter('availableBalance'),
      render: renderAmount('availableBalance'),
      align: 'left',
    },
    {
      title: _t('tJR9VhSemyRNuDEZZBaxJC'), // 冻结
      width: '15%',
      dataIndex: 'holdBalance',
      key: 'holdBalance',
      sorter: assetsSorter('holdBalance'),
      render: renderAmount('holdBalance'),
      align: 'left',
    },
    {
      title: _t('192aSr8iuJPjs2fviG8dvg'), // 负债
      width: '15%',
      // type: 'lg3',
      dataIndex: 'liability',
      key: 'liability',
      sorter: assetsSorter('liability'),
      // align: screen === 'lg1' ? (isRtl ? 'left' : 'right') : isRtl ? 'right' : 'left',
      align: 'left',
      render: renderAmount('liability'),
    },
    {
      title: _t('margin.debt.ratio'), // 负债率
      width: '15%',
      type: 'lg3',
      dataIndex: 'liabilityRate',
      key: 'liabilityRate',
      align: 'left',
      sorter: (a, b) => a.liabilityRate - b.liabilityRate,
      render: (_, record) => {
        return MergeColumnRender.liabilityRate(_, record);
      },
    },
    {
      title: _t('uSVrVmfnLskCUzGZveFaqG'), // 强平价
      width: '15%',
      type: 'lg3',
      dataIndex: 'liquidationPrice',
      key: 'liquidationPrice',
      align: 'left',
      render: (_, record) => {
        return <MergeColumnRender.liquidationPrice record={record} />;
      },
    },
    // lg2屏幕下 将上面两列合并展示
    {
      title: (
        <Fragment>
          <div>{_t('margin.debt.ratio')}</div>
          <div>{_t('uSVrVmfnLskCUzGZveFaqG')}</div>
        </Fragment>
      ),
      width: '15%',
      type: 'lg2',
      dataIndex: 'merge',
      key: 'merge',
      align: 'left',
      render: (_, record) => {
        return (
          <Fragment>
            {MergeColumnRender.liabilityRate(_, record)}
            <MergeColumnRender.liquidationPrice record={record} />
          </Fragment>
        );
      },
    },
    {
      title: _t('margin.entrustList.title.action'), // 操作
      width: screen === 'lg2' ? 80 : 190,
      align: 'right',
      render: (_, record) => {
        const showDropDownOper = screen === 'lg2';
        return (
          <Operation
            record={record}
            showDropDownOper={showDropDownOper}
            showPartDropDownOper={!showDropDownOper}
          />
        );
      },
    },
  ];
};
const ModileItem = ({ record, screen, columns }) => {
  const columnsHere = columns.slice(1, -1);
  return (
    <MWrap.box screen={screen}>
      <Flex vc sb color="text">
        <SymbolRender record={record} />
        <Operation showDropDownOper record={record} />
      </Flex>
      <MWrap.item className="oneCloumn">
        <Text fs={12} color="text40" className="label">
          {_t('iUzxtjG9HVCobyW99bd1oe')}
        </Text>
        <Flex className="symbolsWrapper">
          <SymbolIcon currency={record.baseAsset?.currency} size={16} mb={6} />
          <SymbolIcon currency={record.quoteAsset?.currency} size={16} />
        </Flex>
      </MWrap.item>
      {columnsHere.map((item) => {
        return (
          <MWrap.item className="oneCloumn" key={item.key}>
            <Text color="text40" fs="12" className="label">
              {item.title}
            </Text>
            <div className="valueWrapper">
              {execMaybeFnOrParam(item.render, record[item.key], record, {})}
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
  const screen = useContext(WrapperContext);
  return dataSource.map((record) => (
    <ModileItem key={record.currency} record={record} screen={screen} columns={columns} />
  ));
});

const LG1Item = ({ record, columns, screen }) => {
  const columnsHere = columns.slice(1, -1);
  return (
    <MWrap.box screen={screen}>
      <Flex vc sb color="text">
        <SymbolRender record={record} />
        <Operation record={record} />
      </Flex>
      <MWrap.LG1Wrap screen={screen}>
        {columnsHere.map((item) => {
          return (
            <MWrap.LG1Grid
              key={item.key}
              className={classnames('', {
                threeCloumn: screen === 'lg',
                fourCloumn: screen === 'lg1',
              })}
            >
              <Text color="text40" fs="12" as="div" mb={6}>
                {item.title}
              </Text>
              {execMaybeFnOrParam(item.render, record[item.key], record)}
            </MWrap.LG1Grid>
          );
        })}
      </MWrap.LG1Wrap>
    </MWrap.box>
  );
};
/**
 * @description: lg1屏幕样式
 * @param {*} record
 * @param {*} columns
 * @return {*}
 */
const LG1Mode = React.memo(({ dataSource = [], columns }) => {
  const screen = useContext(WrapperContext);
  return dataSource.map((record) => (
    <LG1Item key={record.currency} record={record} columns={columns} screen={screen} />
  ));
});

export default React.memo(({ height }) => {
  const { colors } = useTheme();
  const { assetsList, positionMap } = useSelector((state) => state.isolated, shallowEqual);
  const currentSymbol = useSelector((state) => state.trade.currentSymbol);
  const isCurrencyPairOnly = useSelector((state) => state.fund.isCurrencyPairOnly);
  const screen = useContext(WrapperContext);

  const { assetsSorter } = useCompareAssets();

  const isolatedPositionTopic = getTopic('/margin/isolatedPosition:{SYMBOL_LIST}', currentSymbol);
  useWorkerSubscribe(isolatedPositionTopic, true);

  const { startPolling, cancelPolling } = usePolling(
    'isolated/pullAssetsList',
    'isolated/registerPullAssetsListPolling',
  );

  const dataSource = useMemo(
    () =>
      getISODataSource({
        currentSymbol,
        assetsList,
        positionMap,
        isCurrencyPairOnly,
      }),
    [currentSymbol, assetsList, positionMap, isCurrencyPairOnly],
  );

  useEffect(() => {
    event.on('transfer.success', onTransferEvent);
    event.on('loanChange.success', refetchList);
    event.on('closePosition.success', refetchList);
    event.on('cancelClosePosition.success', refetchList);

    return () => {
      event.off('transfer.success');
      event.off('loanChange.success');
      event.off('closePosition.success');
      event.off('cancelClosePosition.success');
      cancelPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelPolling, startPolling]);

  useEffect(() => {
    startPolling();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSymbol]);

  const refetchList = useMemoizedFn(({ tag, accountType }) => {
    // 当前交易对走推送
    if ((!accountType || accountType === ISOLATED) && tag !== currentSymbol) {
      startPolling();
    }
  });

  const onTransferEvent = useMemoizedFn(({ from, to }) => {
    const [fromAccountType, fromSymbol] = from;
    const [toAccountType, toSymbol] = to;
    // 当前账户的账务变更走仓位信息
    if (
      (toAccountType === ACCOUNT_CODE.ISOLATED && toSymbol !== currentSymbol) ||
      (fromAccountType === ACCOUNT_CODE.ISOLATED && fromSymbol !== currentSymbol)
    ) {
      startPolling();
    }
  });

  const isRtl = isRTLLanguage();
  const columns = useMemo(() => {
    const raw = columnsCFG({ assetsSorter, colors, screen, isRtl });
    if (screen === 'lg2') {
      return raw.filter((column) => column.type === 'lg2' || column.type === undefined);
    }
    // 带有lg3，默认就是
    return raw.filter((column) => column.type === 'lg3' || column.type === undefined);
  }, [assetsSorter, colors, isRtl, screen]);

  if (['lg2', 'lg3'].includes(screen)) {
    return (
      <CustomTable
        headerBorder
        dataSource={dataSource}
        columns={columns}
        rowKey="tag"
        bordered
        loading={false}
        size="small"
        scroll={{ y: height }}
      />
    );
  }
  if (screen === 'lg1' || screen === 'lg') {
    return <LG1Mode dataSource={dataSource} columns={columns} />;
  }
  return <MobileMode dataSource={dataSource} columns={columns} />;
});
