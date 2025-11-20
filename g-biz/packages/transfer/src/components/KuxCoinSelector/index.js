/**
 * Owner: solar@kupotech.com
 */
import React, { useMemo } from 'react';
import { isFunction } from 'lodash';

import { Select, styled } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import { useMergedState } from '@kufox/mui';
import { Global } from '@kux/mui/emotion';

import { useStateSelector } from '../../hooks/useStateSelector';
import useNewRef from '../../hooks/useNewRef';
import separateNumber from '../../utils/separateNumber';
import CoinIcon from '../MuiCoinIcon';

const ALL = 'all';
const ALL_DESC = 'table.filter.label.allCoin';

const StyledSelect = styled(Select)`
  .dropdownContainer {
    [dir='rtl'] & > div > div {
      direction: rtl !important;
    }
  }
  .optionItem {
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
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 12px;
      text-align: right;

      .availableBalance {
        color: ${(props) => props.theme.colors.text};
        font-weight: 400;
        font-size: 14px;
      }
      .noBalance {
        font-weight: 400;
        font-size: 14px;
      }
    }
  }
  .header {
    height: 100%;
    display: flex;
    font-size: 12px;
    align-items: center;
    padding: 0 16px 0 12px;
    justify-content: space-between;
    color: ${(props) => props.theme.colors.text60};
  }
`;

const MuiCoinSelector = React.memo((props) => {
  const { t: _t } = useTranslation('transfer');
  const {
    loading,
    disabled,
    onChange,
    coinList,
    showIcon,
    newAllDesc,
    needAll = false,
    showOptionsTitle,
    value: valueFromProps,
    searchIcon = true,
    disableClearable = true,
    currencies: currenciesFromProps,
    placeholder,
    size = 'xlarge',
    listItemHeight,
    amountConfig,
    label = _t('account.detail.coin'),
  } = props;

  const amountConfigRef = useNewRef(amountConfig);
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
        label: (isInSelectInput, selected) => {
          let comp = currencie.currencyName || currencie.currency;
          if (currencie.currency && showIcon) {
            comp = <CoinIcon showIcon currency={currencie.currency} />;
          }

          if (amountConfigRef.current?.key && !isInSelectInput) {
            const amountValue = currencie[amountConfigRef.current.key];
            comp = (
              <div className={`${selected ? '' : 'normalItem '}optionItem`}>
                <span className="name">{comp}</span>
                <span className="value">
                  {+amountValue ? (
                    <>
                      <span className="availableBalance">
                        {isFunction(amountConfigRef.current?.render)
                          ? amountConfigRef.current.render(amountValue)
                          : separateNumber(amountValue)}
                      </span>
                    </>
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
  }, [currencies, showIcon]);

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

  const onFilter = (inputVal, option) => {
    let result;
    try {
      result =
        (option.currencyName || option.currency) // 兼容下目前部分因币改名导致的currencyName不存在的情况
          .toLowerCase()
          .indexOf(inputVal.toLowerCase()) >= 0;
    } catch (e) {
      result = false;
    }
    return result;
  };

  return (
    <>
      <StyledSelect
        labelProps={{ shrink: true }}
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
        classNames={{ dropdownContainer: 'transferDropdownContainer' }}
        {...(amountConfigRef.current?.label && showOptionsTitle
          ? {
              dropdownAddonBeforeHeight: 32,
              dropdownAddonBefore: (
                <div className="header">
                  <span>{_t('5pFDUiMWatgckrnStDTWmf')}</span>
                  <span>{amountConfigRef.current.label}</span>
                </div>
              ),
            }
          : null)}
      />
      <Global
        styles={`
        .KuxSelect-optionItem {
          .KuxSelect-itemLabel {
            font-weight: 500;
          }
        }
        .KuxSelect-itemLabel {
          img {
            margin-right: 8px;
          }
        }
        .transferDropdownContainer {
          [dir='rtl'] & > div > div {
            direction: rtl !important;
          }
          .optionItem {
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
              color: ${(props) => props.theme.colors.text40};
              font-weight: 500;
              font-size: 12px;
              text-align: right;
        
              .availableBalance {
                color: ${(props) => props.theme.colors.text};
                font-weight: 400;
                font-size: 14px;
              }
              .noBalance {
                font-weight: 400;
                font-size: 14px;
              }
            }
          }
          .header {
            height: 100%;
            display: flex;
            font-size: 12px;
            align-items: center;
            padding: 0 16px 0 12px;
            justify-content: space-between;
            color: ${(props) => props.theme.colors.text60};
          }
        }
      `}
      />
    </>
  );
});

export default (props) => {
  const categories = useStateSelector('categories');
  const coinList = useMemo(() => Object.values(categories), [categories]);
  return <MuiCoinSelector {...props} coinList={coinList} categories={categories} />;
};
