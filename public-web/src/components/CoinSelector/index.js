/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { css, Global, Select, styled, useMergedState } from '@kux/mui';
import CoinIcon from 'components/common/CoinIcon';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { _t } from 'src/tools/i18n';

const ALL = 'all';
const ALL_DESC = 'all';

const SelectPro = styled(Select)`
  input {
    padding: 0;
  }
`;
const OptionRow = styled.div`
  display: inline-flex;
  align-items: center;
`;
const Label = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const MuiCoinSelector = React.memo((props) => {
  const { isRTL } = useLocale();
  const {
    label,
    loading,
    disabled,
    onChange,
    coinList,
    showIcon,
    newAllDesc,
    needAll = false,
    allowSearch = false,
    value: valueFromProps,
    searchIcon = false,
    disableClearable = true,
    currencies: currenciesFromProps,
    placeholder,
    size = 'xlarge',
    listItemHeight = 48,
    ...otherProps
  } = props;
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
    const allCoins = currenciesFromProps === undefined ? coinList : currenciesFromProps;
    const ALL_KEY = newAllDesc ? ALL_DESC : ALL;
    return needAll ? [{ currency: '', currencyName: _t(ALL_KEY) }, ...allCoins] : allCoins;
  }, [currenciesFromProps, coinList, newAllDesc, needAll]);

  const options = React.useMemo(() => {
    return currencies.map((currencie) => {
      return {
        ...currencie,
        value: currencie.currency,
        label: () => {
          let comp = currencie.currencyName || currencie.currency;
          if (currencie.currency && showIcon) {
            comp = (
              <OptionRow>
                <CoinIcon
                  persist
                  showIcon
                  coin={currencie.currency}
                  maskConfig={{
                    size: 24,
                    maskStyle: isRTL ? { marginRight: 0, marginLeft: 8 } : null,
                  }}
                />
                <Label>{comp}</Label>
              </OptionRow>
            );
          }
          return <Label>{comp}</Label>;
        },
      };
    });
  }, [currencies, showIcon, isRTL]);

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
    <>
      <Global
        styles={css`
          .coinSelect-dropdownContainer {
            * {
              ::-webkit-scrollbar {
                width: 6px;
                height: 2px;
                background: transparent;
              }
              ::-webkit-scrollbar-track {
                background: transparent;
              }
              ::-webkit-scrollbar-thumb {
                background: rgba(0, 20, 42, 0.2);
                border-radius: 8px;
              }
            }
          }
        `}
      />
      <SelectPro
        size={size}
        label={label}
        loading={loading}
        allowSearch={allowSearch}
        searchIcon={searchIcon}
        disabled={disabled}
        filterOption={onFilter}
        allowClear={!disableClearable}
        value={innerValue}
        placeholder={placeholder}
        options={options}
        onChange={handleChange}
        listItemHeight={listItemHeight}
        classNames={{ dropdownContainer: 'coinSelect-dropdownContainer' }}
        {...otherProps}
      />
    </>
  );
});

export default connect((state) => {
  return {
    coinList: state.coins.list,
  };
})(MuiCoinSelector);
