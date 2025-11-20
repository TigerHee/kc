/**
 * Owner: solar@kupotech.com
 */
import { useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'tools/i18n';
import { useTheme, Spin } from '@kux/mui';
import clns from 'classnames';
import { useFormField, useForceFormFieldChange } from '@transfer/hooks/fields';

import {
  useTransferSelector,
  useTransferDispatch,
  useTransferLoading,
} from '@transfer/utils/redux';
import { ICInfoFilled } from '@kux/icons';
import { useProps } from '@transfer/hooks/props';
import { DEFAULT_CURRENCY, MAX_SELECTION } from '@transfer/constants';
import {
  StyledOptions,
  StyledSelect,
  StyledSingleIsolatedCurrencies,
  StyledBatchCurrencies,
  StyledBatchTable,
  StyledSpin,
} from './style';
import { FormItem } from '../../style';

function Option({ icon, currencyName, currency, total, isInSelectInput }) {
  return (
    <StyledOptions>
      <div className="option-left">
        <img src={icon} className="coin-icon" alt="coin-icon" />
        <span>{currencyName || currency}</span>
      </div>
      {!isInSelectInput && <div className="total">{total}</div>}
    </StyledOptions>
  );
}

function CurrenciesSelect(props) {
  const { currencies, ...rest } = props;
  const onFilter = useCallback((inputValue, option) => {
    let result;
    try {
      result = option.labelText.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    } catch (e) {
      result = false;
    }
    return result;
  }, []);
  return (
    <StyledSelect
      labelProps={{ shrink: true }}
      options={currencies.map((currency) => ({
        label: (isInSelectInput) => <Option {...currency} isInSelectInput={isInSelectInput} />,
        labelText: currency.currencyName,
        value: currency.currency,
      }))}
      filterOption={onFilter}
      allowSearch
      searchIcon={false}
      size="xlarge"
      {...rest}
    />
  );
}

// 普通的下拉币种选择组件
function NormalCurrencies(props) {
  const currencies = useTransferSelector((state) => state.currencies);
  const currency = useProps((state) => state.fieldsDefault.currency);
  useEffect(() => {
    props.onChange?.(currency || DEFAULT_CURRENCY);
  }, []);
  return <CurrenciesSelect {...props} currencies={currencies} />;
}

// 两边都是逐仓的币种选择组件
function DoubleSideIsolated(props) {
  const currencies = useTransferSelector((state) => state.currencies);
  useEffect(() => {
    if (currencies && currencies.length) {
      props.onChange?.(currencies[0].currency);
    }
  }, [currencies]);
  return <CurrenciesSelect {...props} currencies={currencies} />;
}

// 单测的逐仓币种选择组件（是两个panel，点击选择）
function SingleSideIsolated(props) {
  const { value, onChange, loading } = props;
  const dispatchTransfer = useTransferDispatch();
  const currencies = useTransferSelector((state) => state.currencies);

  useEffect(() => {
    if (currencies.length === 2 && currencies[0]?.currency && currencies[1]?.currency) {
      if (
        !currencies[1].total ||
        (currencies[0]?.total && currencies[0].total > currencies[1].total)
      ) {
        onChange?.(currencies[0]?.currency);
        dispatchTransfer({
          type: 'update',
          payload: {
            total: currencies[0]?.total,
          },
        });
      } else {
        onChange?.(currencies[1]?.currency);
        dispatchTransfer({
          type: 'update',
          payload: {
            total: currencies[1]?.total,
          },
        });
      }
    } else if (currencies.length === 1) {
      onChange?.(currencies[0]?.currency);
    }
  }, [currencies, dispatchTransfer]);

  if (currencies.length === 0) {
    return null;
  }
  if (currencies.length !== 2) {
    return <CurrenciesSelect {...props} currencies={currencies} />;
  }

  return (
    <StyledSpin spinning={loading} size="small">
      <StyledSingleIsolatedCurrencies>
        {currencies.map((currency) => (
          <div
            className={clns('currency-item', {
              actived: value === currency.currency,
            })}
            key={currency.currency}
            onClick={() => {
              onChange(currency.currency);
            }}
          >
            <img src={currency.icon} alt="currency-icon" className="currency-icon" />
            <div className="content-wrapper">
              <div className="currency-item-name">{currency.currencyName}</div>
              <div className="currency-item-total">{currency.total}</div>
            </div>
          </div>
        ))}
      </StyledSingleIsolatedCurrencies>
    </StyledSpin>
  );
}

function IsolatedCurrencies(props) {
  const payTag = useFormField('payTag');
  const recTag = useFormField('recTag');
  const payAccountType = useFormField('payAccountType');
  const recAccountType = useFormField('recAccountType');
  const _props = useMemo(
    () => ({
      payTag,
      recTag,
      ...props,
    }),
    [payTag, recTag, props],
  );
  if (!payTag && !recTag) return null;
  // 如果是双向逐仓
  if ([payAccountType, recAccountType].every((account) => account === 'ISOLATED')) {
    return <DoubleSideIsolated {..._props} />;
  }
  // 如果是单向逐仓
  return <SingleSideIsolated {..._props} />;
}

// 批量币种选择组件
function BatchCurrencies(props) {
  const { loading } = props;
  const { t: _t } = useTranslation('transfer');
  const theme = useTheme();
  const dispatchTransfer = useTransferDispatch();
  const selectedKeys = useTransferSelector((state) => state.selectedKeys);
  const currencies = useTransferSelector((state) => state.currencies);

  const rowSelection = {
    columnWidth: 30,
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys) => {
      const _selectedKeys = selectedRowKeys.slice(0, MAX_SELECTION);
      dispatchTransfer({
        type: 'update',
        payload: {
          selectedKeys: _selectedKeys,
        },
      });
    },
    getCheckboxProps: (record) => {
      return {
        disabled: selectedKeys.length >= MAX_SELECTION && !selectedKeys.includes(record.currency),
      };
    },
  };
  const dataSource = useMemo(() => {
    return currencies.filter((currency) => +currency.total);
  }, [currencies]);
  const columns = useMemo(
    () => [
      {
        title: _t('vote.coin-type'),
        dataIndex: 'currency',
        width: 100,
        render: (currency) => {
          return currency;
        },
      },
      {
        title: _t('transfer.batch.amount'),
        dataIndex: 'total',
        align: 'right',
        render: (total) => {
          return total;
        },
      },
    ],
    [],
  );
  useEffect(() => {
    return () => {
      dispatchTransfer({
        type: 'update',
        payload: {
          selectedKeys: [],
        },
      });
    };
  }, []);
  return (
    <StyledSpin spinning={loading} size="small">
      <StyledBatchCurrencies>
        <div className="batch-container">
          <StyledBatchTable
            rowSelection={{
              ...rowSelection,
            }}
            sticky
            dataSource={dataSource}
            columns={columns}
            rowKey="currency"
            bordered
            rowClassName="batch-currency-item"
            headerType="transparent"
            style={{
              overflowX: 'hidden',
            }}
          />
        </div>
        {selectedKeys.length >= MAX_SELECTION && (
          <p className="tip">
            <ICInfoFilled color={theme.colors.complementary} />
            <span>{_t('transfer.batch.limit', { limitAmount: MAX_SELECTION })}</span>
          </p>
        )}
      </StyledBatchCurrencies>
    </StyledSpin>
  );
}

export default function Currency(props) {
  const { t: _t } = useTranslation('transfer');
  const isBatchEnable = useTransferSelector((state) => state.isBatchEnable);
  const isSupportBatch = useTransferSelector((state) => state.isSupportBatch);
  const isPullingCurrencies = useTransferLoading('pullCurrencies');
  const payAccountType = useFormField('payAccountType');
  const recAccountType = useFormField('recAccountType');
  const RenderCurrency = useMemo(() => {
    if (isSupportBatch && isBatchEnable) return BatchCurrencies;
    if ([payAccountType, recAccountType].some((account) => account === 'ISOLATED'))
      return IsolatedCurrencies;
    return NormalCurrencies;
  }, [isBatchEnable, payAccountType, recAccountType, isSupportBatch]);
  return (
    <FormItem name="currency" label={_t('account.detail.coin')}>
      <RenderCurrency {...{ ...props, loading: isPullingCurrencies }} />
    </FormItem>
  );
}
