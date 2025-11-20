/**
 * Owner: willen@kupotech.com
 */
import { css, Select, useMergedState, useTheme } from '@kux/mui';
import { Global } from '@kux/mui/emotion';
import CoinIcon from 'components/common/MuiCoinIcon';
import NumberFormat from 'components/common/NumberFormat';
import { isFunction } from 'lodash-es';
import React from 'react';
import { connect } from 'react-redux';
import useNewRef from 'src/hooks/useNewRef';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';

const ALL = 'all';
const ALL_DESC = 'table.filter.label.allCoin';

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
    header: css`
      height: 100%;
      display: flex;
      font-size: 12px;
      align-items: center;
      padding: 0 16px 0 12px;
      justify-content: space-between;
      color: ${colors.text60};
    `,
  };
};

const MuiCoinSelector = React.memo((props) => {
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

  const { currency: fiatCurrency } = useSelector((state) => state.currency);
  const theme = useTheme();
  const amountConfigRef = useNewRef(amountConfig);
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
    const allCoins = currenciesFromProps === undefined ? coinList : currenciesFromProps;
    const ALL_KEY = newAllDesc ? ALL_DESC : ALL;
    return needAll ? [{ currency: '', currencyName: _t(ALL_KEY) }, ...allCoins] : allCoins;
  }, [currenciesFromProps, coinList, newAllDesc, needAll]);

  const options = React.useMemo(() => {
    return currencies.map((currencie) => {
      return {
        ...currencie,
        value: currencie.currency,
        label: (isInSelectInput) => {
          let comp = currencie.currencyName || currencie.currency;
          if (currencie.currency && showIcon) {
            comp = <CoinIcon showIcon currency={currencie.currency} />;
          }

          if (amountConfigRef.current?.key && !isInSelectInput) {
            const amountValue = currencie[amountConfigRef.current.key];
            comp = (
              <div css={classes.optionItem}>
                <span className="name">{comp}</span>
                <span className="value">
                  {+amountValue ? (
                    <React.Fragment>
                      <span className="availableBalance">
                        {isFunction(amountConfigRef.current?.render) ? (
                          amountConfigRef.current.render(amountValue)
                        ) : (
                          <NumberFormat>{amountValue}</NumberFormat>
                        )}
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
  }, [currencies, showIcon, classes.optionItem]);

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
      <Select
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
        classNames={{ dropdownContainer: classes.dropdownContainer }}
        {...(amountConfigRef.current?.label && showOptionsTitle
          ? {
            dropdownAddonBeforeHeight: 32,
            dropdownAddonBefore: (
              <div className={classes.header}>
                <span>{_t('5pFDUiMWatgckrnStDTWmf')}</span>
                <span>{amountConfigRef.current.label}</span>
              </div>
            ),
          }
          : {})}
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
      `}
      />
    </>
  );
});

export default connect((state) => {
  return {
    categories: state.categories,
    coinList: state.coins.list,
    coinNamesMap: state.coins.coinNamesMap,
  };
})(MuiCoinSelector);
