/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { Select, styled } from '@kux/mui';
import { isForbiddenCountry } from 'common/meta/countries';
import _ from 'lodash';
import map from 'lodash/map';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';

const noop = () => {};

const ItemWrapperSelected = styled.div`
  width: 96px;
`;

const ItemWrapperInInput = styled.div`
  width: 96%;
`;

const ItemLabel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  ${(props) => props.selected ?? ItemWrapperSelected}
`;

const ItemWrapper = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => props.selected ?? ItemWrapperSelected};
  ${(props) => props.isInSelectInput ?? ItemWrapperInInput};
`;

const ConfirmIcon = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CountryItem = styled.div`
  display: flex;
  align-items: center;
`;

const Tip = styled.div`
  font-size: 12px;
`;

const Ico = styled.img`
  width: 28px;
  height: 16px;
  margin-right: 4px;
`;

const NotSurpports = styled.span`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
  padding: 2px 6px;
  color: rgba(29, 29, 29, 0.6);
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  background: rgba(29, 29, 29, 0.04);
  border-radius: 4px;
  margin-left: 6px;
`;

const DropdownContainer = styled(Select)`
  [dir='rtl'] & > div > div {
    direction: rtl !important;
  }
`;

@connect((state) => {
  const { countryList = [] } = state.homepage;
  return {
    countryList,
  };
})
@injectLocale
class CountrySelector extends React.Component {
  componentDidMount() {
    const { countryList, dispatch } = this.props;
    if (countryList && !countryList.length) {
      dispatch({
        type: 'homepage/getCountryCodes',
      });
    }
  }

  onChange = (option, value) => {
    const { onChange = noop } = this.props;
    onChange(value);
  };

  // 过滤国家
  filterCountry = (inputValue, option) => {
    const { mobilecode = '', value = '', children, origin } = option.props;
    const inputRegExp = new RegExp(inputValue.replace(/[+.?/\\]/, ''), 'img');
    if (origin || (children && children.props.origin)) {
      const { cn, code, en, mobileCode } = origin || children.props.origin;
      return [cn, code, en, mobileCode].some((v) => v && inputRegExp.test(v));
    }
    return [children, mobilecode, value].some((v) => v && v.match && v.match(inputRegExp));
  };

  getOptions = () => {
    const {
      countryList,
      currentLang,
      showCountryName = true,
      forbiddenCountry = true,
    } = this.props;
    const filteredCountries = _.filter(countryList, (item) => !isForbiddenCountry(item.mobileCode));
    // 根据当前语言显示name
    const nameKey = currentLang === 'zh_CN' ? 'cn' : 'en';
    const tip = <Tip>{_t('sms.help')}</Tip>;

    const data = map(filteredCountries, (country) => {
      const disabled = !!(forbiddenCountry && country.dismiss);
      return {
        label: (isInSelectInput, selected) => {
          return (
            <ItemLabel selected={selected}>
              <ItemWrapper selected={selected} isInSelectInput={isInSelectInput}>
                <CountryItem>
                  <Ico alt="country-logo" src={country.ico} />
                  {showCountryName && <span>{country[nameKey]}</span>}
                  {disabled && <NotSurpports>{_t('uCQNHSVrZKcrqS71dULWqJ')}</NotSurpports>}
                </CountryItem>
                <span>+{country.mobileCode}</span>
              </ItemWrapper>
            </ItemLabel>
          );
        },
        // 注意：这里不能直接用mobileCode来作为value，因为 多米尼加 加拿大 美国 mobileCode 都是1
        // value: country.mobileCode,
        value: country.code, // 使用他的code来作为value
        title: country[nameKey],
        mobileCode: country.mobileCode,
        disabled: disabled,
      };
    });
    data.push({ label: tip, value: '', title: '', disabled: true });
    return data;
  };

  render() {
    const { size, defaultValue, disabled = false } = this.props;
    return (
      <DropdownContainer
        data-inspector="country-selector"
        allowSearch
        filterOption={(str, options) => options?.mobileCode?.includes(str)}
        placeholder={_t('country.code')}
        emptyContent={true}
        options={this.getOptions()}
        onChange={this.onChange}
        disabled={disabled}
        defaultValue={defaultValue}
        size={size ?? 'large'}
      />
    );
  }
}

export default CountrySelector;
