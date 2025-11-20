/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { connect } from 'react-redux';
import { Select } from '@kc/ui';
import style from './style.less';
import _ from 'lodash';
import { injectLocale } from '@kucoin-base/i18n';

const { Option } = Select;
const _ALL_ = {
  currency: '',
  currencyName: 'all',
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
    _ALL_.currencyName = _t(_ALL_.currencyName);
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
    const { index, value, name } = option.props;
    const lowcaseInput = (inputValue || '').toLowerCase();
    return [index, value, name].some((v) => {
      return (v || '').toLowerCase().indexOf(lowcaseInput) > -1;
    });
  };

  render() {
    const { size, hideName = false, ...others } = this.props;
    const items = this.getCurrency();
    return (
      <Select
        dropdownClassName={style.select}
        placeholder=""
        // placeholder="搜索币种"
        size={size}
        optionLabelProp="children"
        style={{ width: '100%' }}
        allowClear
        showSearch
        dropdownMatchSelectWidth
        value={this.state.value}
        onChange={this.handleChange}
        getPopupContainer={(node) => node.parentNode}
        filterOption={this.handleFilter}
        {...others}
      >
        {items.map((option, idx) => {
          option = option || {};
          return (
            <Option
              value={option.currency}
              key={idx}
              index={option.currencyName}
              name={option.name}
            >
              <div className={style.CoinItem}>
                {option.iconUrl && <img src={option.iconUrl} alt="" />}
                {option.currencyName && <span className={style.name}>{option.currencyName}</span>}
                {!hideName && option.name && <span>{option.name}</span>}
              </div>
            </Option>
          );
        })}
      </Select>
    );
  }
}
