/**
 * Owner: judith.zhu@kupotech.com
 */
import { ICInfoFilled } from '@kux/icons';
import { InputNumber, Spin as KuxSpin, Table } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
import CoinPrecision from 'components/common/CoinPrecision';
import { isNumber, map } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { VirtualizedList, VirtualizedMaskFilter } from 'src/components/VirtualizedFixList';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { ACCOUNT_CODE } from './config';
import { SMMax as Max } from './styles/index/style';

const Spin = styled(KuxSpin)`
  width: 100%;
  height: 200px;
`;

const MultiCoins = styled.div`
  .KuxCheckbox-inner {
    width: 20px;
    height: 20px;
  }
  .tableWrapper {
    width: 488px;
    margin-left: -16px;
    padding: 0 16px;
    overflow-x: hidden;
    overflow-y: scroll;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    ${({ theme }) => theme.breakpoints.down('sm')} {
      width: 100%;
      max-width: 488px;
    }
  }
  table {
    tr {
      th:first-of-type,
      td:first-of-type {
        width: 20px;
      }
      &.editableTableRow {
        td {
          padding-top: 8px;
          padding-bottom: 8px;
          border-bottom: none;
        }
      }
    }
    th {
      padding: 8px;
      font-size: 14px;
      background: transparent;
      svg {
        vertical-align: middle;
      }
    }
    td {
      padding: 12px 8px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
      label {
        line-height: 1;
      }
    }
  }
  .tip {
    display: flex;
    align-items: center;
    margin: 10px 0 0;
    color: ${({ theme }) => theme.colors.text68};
    svg {
      margin-right: 6px;
      color: ${({ theme }) => theme.colors.complementary};
      vertical-align: middle;
    }
  }
`;

const AmountWrap = styled.div`
  position: relative;
`;

const AmountInput = styled(InputNumber)`
  width: 200px;
  float: right;

  input {
    font-size: 15px;
  }
`;
const AmountInputTip = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.secondary};
  position: absolute;
  bottom: -50px;
  right: 0;
`;

const CurrencyBox = styled.span`
  font-weight: 500;
`;

const TableTip = styled.span`
  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Balance = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 12px;
  line-height: 1.5;
`;

const NoBalance = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  line-height: 1;
`;

// 数字格式正则
const numReg = /^[0-9]+(\.?[0-9]*)?$/;

export default ({
  to,
  currencies,
  loading,
  style,
  onSelected,
  maxSelection = 10,
  editable = false,
}) => {
  const [toAccountType] = to;
  const isToMainAccount = toAccountType === ACCOUNT_CODE.MAIN;
  const dispatch = useDispatch();
  const showDataKey = useRef([]); // 虚拟列表-当前渲染中的列表的currency
  const selectedRowKeysRef = useRef([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currencyAmount, setCurrencyAmount] = useState({}); // 自定义币种金额
  const { batchLendConfigMap } = useSelector((state) => state.transfer);
  // const { currency } = useSelector((state) => state.currency);

  const columns = useMemo(() => {
    return [
      {
        title: _t('vote.coin-type'),
        dataIndex: 'currency',
        width: 100,
        render: (v, record) => {
          return <CurrencyBox>{v}</CurrencyBox>;
          // return <CoinIcon showIcon={true} currency={v} style={{ verticalAlign: 'middle' }} />;
        },
      },
      {
        title: _t('transfer.batch.amount'),
        dataIndex: 'availableBalance',
        align: 'right',
        render: (v, record, index) => {
          const { currency, precision = 8 } = record;
          const max = +v;
          const nowAmount = currencyAmount[currency];
          const error =
            nowAmount && (!numReg.test(nowAmount) || +nowAmount <= 0 || +nowAmount > +max);
          return editable ? (
            <AmountWrap>
              <AmountInput
                error={error}
                controls={false}
                size={'small'}
                placeholder={max}
                precision={precision}
                autoFixPrecision={true}
                value={nowAmount !== undefined ? nowAmount : max}
                onChange={(amount) => handleAmount({ currency, amount })}
                unit={
                  <Max onClick={() => handleAmount({ currency, amount: max })}>
                    {_t('i59WspMk1h9yP5tAzyCXt5')}
                  </Max>
                }
              />
              {error && (
                <AmountInputTip>
                  {+nowAmount > +max
                    ? `${_t('transfer.trans.avaliable')} ${max}`
                    : `${_t('trans.amount.num.err')}`}
                </AmountInputTip>
              )}
            </AmountWrap>
          ) : +v ? (
            <>
              <CoinPrecision coin={record.currency} value={v} />
              {/* <Balance>
                {record.availableBaseLegalCurrency ? (
                  <span>{`≈ ${separateNumber(
                    setNumToPrecision(record.availableBaseLegalCurrency),
                  )} ${currency}`}</span>
                ) : (
                  <CoinCurrency defaultValue="--" coin={record.currency} value={v} />
                )}
              </Balance> */}
            </>
          ) : (
            <NoBalance>
              <CoinPrecision coin={record.currency} value={v} />
            </NoBalance>
          );
        },
      },
    ];
    // }
  }, [batchLendConfigMap, currencyAmount, currencies]);

  useEffect(() => {
    // currencies切换 初始化已选列表
    setSelectedRowKeys([]);
    setCurrencyAmount({});
    selectedRowKeysRef.current = [];
    onSelected && onSelected([], []);
  }, [currencies]);

  const getRealSelectedRowKeys = useCallback(
    (selectedRowKeys, maxSelection) => {
      // 如果上次选中的币种不在showData中，将上次选中的币种补充到selectedRowKeys中
      let allSelectedRowKeys = selectedRowKeys;
      selectedRowKeysRef.current.forEach((precSelected) => {
        if (
          !showDataKey.current.includes(precSelected) &&
          !allSelectedRowKeys.includes(precSelected)
        ) {
          allSelectedRowKeys.push(precSelected);
        }
      });
      return allSelectedRowKeys.slice(0, maxSelection);
    },
    [showDataKey],
  );

  const selectedRows = useMemo(() => {
    let res = [];
    res = map(selectedRowKeys, (key) => {
      const row = currencies.find((val) => val.currency === key);
      if (row) {
        return {
          ...row,
          transferBalance: currencyAmount[key] || row.availableBalance,
        };
      }
      return {
        currency: key,
        availableBalance: 0,
        transferBalance: 0,
      };
    });
    return res;
  }, [currencyAmount, selectedRowKeys, currencies]);

  const rowSelection = {
    columnWidth: 30,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      const realSelectedRowKeys = getRealSelectedRowKeys(selectedRowKeys, maxSelection);
      // const realSelectedRows = getRealSelectedRows(realSelectedRowKeys);
      setSelectedRowKeys(realSelectedRowKeys);
      selectedRowKeysRef.current = realSelectedRowKeys;
      // onSelected && onSelected(realSelectedRowKeys, realSelectedRows);
    },
    getCheckboxProps: (record) => {
      return {
        disabled:
          selectedRowKeys.length >= maxSelection && !selectedRowKeys.includes(record.currency),
      };
    },
  };

  // 币种自定义划转金额
  const handleAmount = useCallback(
    ({ currency, amount }) => {
      setCurrencyAmount({
        ...currencyAmount,
        [currency]: isNumber(+amount) ? amount : 0,
      });
    },
    [currencyAmount],
  );

  const showTip = useMemo(() => {
    return selectedRowKeys.length >= maxSelection;
  }, [selectedRowKeys, maxSelection]);

  const renderRow = (showData) => {
    showDataKey.current = map(showData, (data) => data.currency);
    return loading ? (
      <Spin size="small" />
    ) : (
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        sticky={true}
        dataSource={showData}
        columns={columns}
        rowKey="currency"
        rowClassName={editable ? 'editableTableRow' : 'tableRow'}
        loading={loading}
        // scroll={{
        //   y: showTip ? 206 : 240,
        // }}
        style={{
          overflowX: 'hidden',
        }}
      />
    );
  };

  useEffect(() => {
    onSelected && onSelected(selectedRowKeys, selectedRows);
  }, [selectedRowKeys, JSON.stringify(selectedRows)]);

  const filteredCurrencies = currencies.filter((currency) => +currency.availableBalance > 0);
  return (
    <MultiCoins style={style}>
      <VirtualizedMaskFilter>
        {({ rectRef, top, bottom }) => {
          return (
            <div
              className="tableWrapper"
              style={{
                maxHeight: showTip ? 206 : 240,
                height: filteredCurrencies.length * 48 + 50,
              }}
              ref={rectRef}
            >
              <VirtualizedList
                maskFilterRectTop={top}
                maskFilterRectBottom={bottom}
                data={filteredCurrencies}
                rowHeight={48}
                bufferSize={20}
                showRender={renderRow}
                noRowsRender={renderRow}
              />
            </div>
          );
        }}
      </VirtualizedMaskFilter>
      {showTip && (
        <p className="tip">
          <ICInfoFilled />
          {_t('transfer.batch.limit', { limitAmount: maxSelection })}
        </p>
      )}
    </MultiCoins>
  );
};
