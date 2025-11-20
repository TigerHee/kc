/**
 * Owner: melon@kupotech.com
 */
/** 2024.06.26 资产页-黑白主题适配 */
import React from 'react';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import { Select } from '@kux/mui';

import { styled } from '@kux/mui/emotion';
import _ from 'lodash';
import { injectLocale } from '@kucoin-base/i18n';

const CoinItem = styled.div`
  display: flex;
  align-items: center;
  .name {
    color: ${({ theme }) => theme.colors.text} !important;
    font-size: 14px;
  }
  span.allLabel {
    margin-left: 0;
    color: ${({ theme }) => theme.colors.text60} !important;
  }
  img {
    width: 18px;
    height: 18px;
  }
  span {
    margin-left: 6px;
    &:first-child {
      color: ${({ theme }) => theme.colors.text};
      font-size: 14px;
    }
    &:last-child {
      color: ${({ theme }) => theme.colors.text40};
      font-size: 12px;
    }
  }
`;
const { Option } = Select;
const _ALL_ = {
  currency: '',
  currencyName: _t('all'),
};

@connect((state) => {
  return {
    list: state.coins.list,
    categories: state.categories,
  };
})
@injectLocale
export default class CoinSelector extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if ('value' in nextProps || 'coin' in nextProps) {
      return {
        ...prevState,
        value: nextProps.value || nextProps.coin || null,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.coin || props.value || null,
    };
  }

  handleChange = (value) => {
    const { handleCoinChange, onChange } = this.props;
    if (!('value' in this.props && 'coin' in this.props)) {
      this.setState({
        value,
      });
    }
    if (typeof onChange === 'function') {
      onChange(value);
    }
    if (typeof handleCoinChange === 'function') {
      handleCoinChange(value);
    }
  };

  getCurrency = () => {
    const { currencies, categories, list, needAll, coinAll } = this.props;
    // all选项添加标记
    _ALL_._all = true;
    let temp = [];
    if (!currencies) {
      temp = [...list];
    } else {
      _.map(currencies, (item) => {
        const { currency } = item || {};
        const currentCoin = categories[currency];
        if (currentCoin) {
          temp.push({
            ...currentCoin,
            ...item,
          });
        }
      });
    }
    if (needAll) {
      if (coinAll != null) {
        temp = [coinAll, ...temp];
      } else {
        temp = [_ALL_, ...temp];
      }
    }
    return temp;
  };

  handleFilter = (inputValue, option) => {
    const { index, value, title } = option;
    const lowcaseInput = (inputValue || '').toLowerCase();
    return [index, value, title].some((v) => {
      return (v || '').toLowerCase().indexOf(lowcaseInput) > -1;
    });
  };

  getOptions = (items) => {
    const { hideName = false, textOverflow, classNames = {} } = this.props;
    return items.map((option, idx) => {
      return {
        label: (isInSelectInput) => {
          const allLabel = option?._all && classNames?.item ? 'allLabel' : '';
          return (
            <CoinItem className={`${classNames?.item || ''}`}>
              {option?.iconUrl && <img src={option?.iconUrl} alt="icon" />}
              {option?.currencyName && (
                <span className={`${'name'} ${allLabel}`}>{option?.currencyName}</span>
              )}
              {/* 小屏幕状态文本太长... */}
              {!hideName && option?.name && (
                <span className={isInSelectInput ? textOverflow : null}>{option?.name}</span>
              )}
            </CoinItem>
          );
        },
        value: option.currency,
        title: option.name,
        index: option.currencyName,
      };
    });
  };

  render() {
    const { size, hideName = false, allowClear = true, ...others } = this.props;
    const items = this.getCurrency();
    const options = this.getOptions(items);
    return (
      <Select
        placeholder=""
        size={size}
        allowClear={allowClear}
        showSearch
        allowSearch
        options={options}
        value={this.state.value}
        onChange={this.handleChange}
        filterOption={this.handleFilter}
        className={'newSelect'}
        {...others}
      />
    );
  }
}
