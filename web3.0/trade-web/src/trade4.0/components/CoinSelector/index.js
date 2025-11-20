/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import { isFunction } from 'lodash';
import { Select, useTheme, useMergedState } from '@kux/mui';
import { _t } from 'utils/lang';
import styled from '@emotion/styled';

import CoinIcon from '@/components/CoinIcon';
import useStateRef from '@/hooks/common/useStateRef';
import { css } from '@emotion/css';
import { formatNumber } from '@/utils/format';
import { connect } from 'dva';

const ALL = 'all';
const ALL_DESC = 'all';

const SelectPro = styled(Select)`
  input {
    padding: 0;
  }
`;
const Header = styled.div`
  height: 100%;
  display: flex;
  font-size: 12px;
  align-items: center;
  padding: 0 16px 0 12px;
  justify-content: space-between;
  color: ${props => props.theme.colors.text60};
`;

/**
 * copy from main-web
 */
const useStyle = ({ colors }) => {
  return {
    dropdownContainer: css`
      [dir='rtl'] & > div > div {
        direction: rtl !important;
      }
    `,
    optionItem: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 4px;
      span.name {
        > div {
          display: flex;
          align-items: center;
        }
      }

      .value {
        display: flex;
        flex-direction: column;
        color: ${colors.text40};
        font-weight: 500;
        font-size: 12px;
        text-align: right;

        .availableBalance {
          color: ${colors.text};
          font-weight: 400;
          font-size: 14px;
        }
        .noBalance {
          font-weight: 400;
          font-size: 14px;
        }
      }
    `,
  };
};

const MuiCoinSelector = React.memo((props) => {
  const {
    label,
    loading,
    disabled,
    onChange,
    coinList,
    showIcon,
    newAllDesc,
    needAll = false,
    showOptionsTitle,
    value: valueFromProps,
    searchIcon = false,
    disableClearable = true,
    currencies: currenciesFromProps,
    placeholder,
    size = 'xlarge',
    listItemHeight = 48,
    amountConfig,
  } = props;

  const theme = useTheme();
  const amountConfigRef = useStateRef(amountConfig);
  const classes = useStyle({ colors: theme.colors });

  const [innerValue, setInnerValue] = useMergedState(undefined, {
    value: valueFromProps,
    postState: (mergedValue) => {
      if (!mergedValue && needAll) {
        return '';
      }
      return mergedValue;
    },
  });

  const currencies = React.useMemo(() => {
    const allCoins =
      currenciesFromProps === undefined ? coinList : currenciesFromProps;
    const ALL_KEY = newAllDesc ? ALL_DESC : ALL;
    return needAll
      ? [{ currency: '', currencyName: _t(ALL_KEY) }, ...allCoins]
      : allCoins;
  }, [currenciesFromProps, coinList, newAllDesc, needAll]);

  const options = React.useMemo(() => {
    return currencies.map((currencie) => {
      return {
        ...currencie,
        value: currencie.currency,
        label: (isInSelectInput, selected) => {
          let comp = currencie.currencyName || currencie.currency;
          if (currencie.currency && showIcon) {
            comp = <CoinIcon showIcon currency={currencie.currency} />;
          }

          if (amountConfigRef.current?.key && !isInSelectInput) {
            const amountValue = currencie[amountConfigRef.current.key];
            comp = (
              <div
                className={`${selected ? '' : classes.normalItem} ${
                  classes.optionItem
                }`}
              >
                <span className="name">{comp}</span>
                <span className="value">
                  {+amountValue ? (
                    <React.Fragment>
                      <span className="availableBalance">
                        {isFunction(amountConfigRef.current?.render)
                          ? amountConfigRef.current.render(amountValue)
                          : formatNumber(amountValue)}
                      </span>
                    </React.Fragment>
                  ) : (
                    <span className="noBalance">{amountValue}</span>
                  )}
                </span>
              </div>
            );
          }
          return comp;
        },
      };
    });
  }, [
    currencies,
    showIcon,
    classes.optionItem,
    classes.normalItem,
  ]);

  const handleChange = React.useCallback(
    (v) => {
      if (valueFromProps === undefined) {
        setInnerValue(v);
      }
      if (onChange) {
        onChange(v);
      }
    },
    [onChange, setInnerValue, valueFromProps],
  );

  const onFilter = useCallback((inputVal, option) => {
    let result;
    try {
      result =
        (option.currencyName || option.currency) // 兼容下目前部分因币改名导致的currencyName不存在的情况
          .toLowerCase()
          .indexOf(inputVal?.toLowerCase()) >= 0;
    } catch (e) {
      result = false;
    }
    return result;
  }, []);

  return (
    <SelectPro
      size={size}
      label={label}
      loading={loading}
      allowSearch
      searchIcon={searchIcon}
      disabled={disabled}
      filterOption={onFilter}
      allowClear={!disableClearable}
      value={innerValue}
      placeholder={placeholder}
      options={options}
      onChange={handleChange}
      listItemHeight={listItemHeight}
      classNames={{ dropdownContainer: classes.dropdownContainer }}
      {...amountConfigRef.current?.label && showOptionsTitle ? {
        dropdownAddonBeforeHeight: 32,
        dropdownAddonBefore: (
          <Header>
            <span>{_t('iUzxtjG9HVCobyW99bd1oe')}</span>
            <span>{amountConfigRef.current.label}</span>
          </Header>
        ),
      } : null}
    />
  );
});

export default connect((state) => {
  return {
    categories: state.categories,
    coinList: state.coins.list,
    coinNamesMap: state.coins.coinNamesMap,
  };
})(MuiCoinSelector);
