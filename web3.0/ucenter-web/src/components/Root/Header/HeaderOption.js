/**
 * Owner: willen@kupotech.com
 */
import SvgIcon from 'components/common/KCSvgIcon';
import SelectPane from 'components/SelectPane';
import { get, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { injectLocale } from '@kucoin-base/i18n';
import { HeaderOption, WorldSvg } from './styled';

@connect((state) => {
  return {
    // lang: state.app.currentLang,
    langList: state.app.langList,
    currency: state.currency.currency,
    currencies: state.currency.currencyList,
  };
})
@injectLocale
export default class TopLine extends React.Component {
  static defaultProps = {
    currencyRender: true,
  };

  static propTypes = {
    currencyRender: PropTypes.bool,
  };

  handleLangChange = (lang) => {
    this.props.changeLocale(lang);
  };

  handleCurrencyChange = (currency) => {
    this.props.dispatch({ type: 'currency/selectCurrency', payload: { currency } });
    // 在OTC页面切换法币汇率需要刷新页面
    if (get(window, 'location.href', '').indexOf('/otc') > -1) {
      window.location.reload();
    }
    // 更换法币类型时，重新拉取数字货币对应法币的汇率
    this.props.dispatch({ type: 'currency/pullPrices', payload: { currency } });
  };

  render() {
    const { currentLang: lang, langList, currency, currencies, currencyRender } = this.props;
    const currentLang = langList.filter((item) => {
      return item[0] === lang;
    })[0] || ['en_US', 'English'];
    const currentCurrency = currencies.filter((item) => {
      return item === currency;
    });

    return (
      <HeaderOption>
        {currencyRender ? (
          <span className="link">
            {currencies.length > 0 && (
              <SelectPane
                placement="bottom-end"
                value={currency}
                className="currencySelect"
                wrapperClassName="selectCurrency"
                itemClassName="itemSelectCurrency"
                onChange={this.handleCurrencyChange}
                items={map(currencies, (item) => {
                  return {
                    value: item,
                    title: item,
                    label: item,
                  };
                })}
              >
                <div className="currencySelect">
                  <span className="mr-4">{currentCurrency}</span>
                </div>
              </SelectPane>
            )}
          </span>
        ) : null}
        <span className="link" style={{ marginRight: 0, display: 'inherit' }}>
          {/* <img className={style.WorldSvg} src={WorldSvg} /> */}
          <SvgIcon css={WorldSvg} iconId="world" />
        </span>
        <span className="link" style={{ marginLeft: '4px' }}>
          {langList.length > 0 && (
            <SelectPane
              key="2"
              placement="bottom-end"
              value={lang}
              onChange={this.handleLangChange}
              items={map(langList, (item) => {
                return {
                  value: item[0],
                  title: item[1],
                  label: item[1],
                };
              })}
            >
              <span className="mr-4">{currentLang[1]}</span>
            </SelectPane>
          )}
        </span>
      </HeaderOption>
    );
  }
}
