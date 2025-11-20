/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { _t } from 'tools/i18n';
import { Modal, Icon } from '@kc/ui';
import { regionOptions } from 'common/meta/countries';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@connect((state) => {
  return {
    isLogin: state.user.isLogin,
    // isCN: state.app.currentLang === 'zh_CN',
  };
})
@injectLocale
export default class CountryCheck extends React.Component {
  static propTypes = {
    rule: PropTypes.object,
    isCompletedKyc: PropTypes.bool,
    isKycCountryInBlackList: PropTypes.bool,
    children: PropTypes.func.isRequired,
  };

  static defaultProps = {
    rule: {},
  };

  state = {
    visibleModal: false,
  };

  openModal = () => {
    this.setState({ visibleModal: true });
  };

  closeModal = () => {
    this.setState({ visibleModal: false });
  };

  render() {
    const { isLogin, isCN, rule, isKycCountryInBlackList, isCompletedKyc, children } = this.props;
    const { visibleModal } = this.state;

    const { countryCodeBlackList = [] } = rule;
    const countriesBlackList = [];
    _.each(regionOptions, ({ code, en, cn }) => {
      if (_.indexOf(countryCodeBlackList, code) > -1) {
        countriesBlackList.push(isCN ? cn : en);
      }
    });

    return (
      <React.Fragment>
        <Modal
          title={_t('spotlight.country.blacklist')}
          width={350}
          maskClosable={false}
          visible={visibleModal}
          onCancel={this.closeModal}
          footer={null}
        >
          {countriesBlackList.join(', ')}
        </Modal>
        <div onClick={this.openModal}>
          {children(
            <React.Fragment>
              <div className={style.name}>{_t('spotlight.country.blacklisttip')}</div>
              {isLogin &&
                (isCompletedKyc ? (
                  <React.Fragment>
                    {isKycCountryInBlackList ? (
                      <div className={style.redtip} key="country-red">
                        <Icon type="close-circle" theme="filled" />
                        {_t('spotlight.nocondition')}
                      </div>
                    ) : (
                      <div className={style.greentip} key="country-green">
                        <Icon type="check-circle" theme="filled" />
                        {_t('spotlight.condition')}
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <div className={style.bluetip}>{_t('spotlight.see')}</div>
                ))}
            </React.Fragment>,
          )}
        </div>
      </React.Fragment>
    );
  }
}
