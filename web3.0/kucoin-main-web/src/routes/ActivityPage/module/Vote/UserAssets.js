/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import { _t, _tHTML } from 'tools/i18n';
import { connect } from 'react-redux';
import style from './style.less';
import AssetTransformPop from 'components/AssetTransformPop';
import { ActivityStatus } from 'config/base';
import { injectLocale } from '@kucoin-base/i18n';

@connect((state) => {
  return {
    mainMap: state.user_assets.mainMap,
    user: state.user.user,
  };
})
@injectLocale
export default class UserAssets extends React.Component {
  state = {
    visible: false,
  };

  transFormState = (visible) => {
    this.setState({
      visible,
    });
  };

  afterSubmitCallback = () => {
    this.transFormState(false);
  };

  render() {
    const { visible } = this.state;
    const { mainMap, user, status } = this.props;
    const show = user && status === ActivityStatus.PROCESSING;
    if (!show) {
      return null;
    }
    const KCSAssets = mainMap.KCS || {};
    return (
      <div className={style.userAssetsBox}>
        <div className={style.userAssets}>
          <div className={style.userAssetsItem}>
            <p>{_t('kcs.main.amount')}:&nbsp;</p>
            <p>{KCSAssets.totalBalance}KCS</p>
          </div>
          <div className={style.userAssetsItem}>
            <p>{_t('available')}:&nbsp;</p>
            <p>{KCSAssets.availableBalance}KCS</p>
          </div>
          <div className={style.userAssetsItem}>
            <p>{_t('freeze')}:&nbsp;</p>
            <p>{KCSAssets.holdBalance}KCS</p>
          </div>
        </div>
        <div className={style.tips}>
          <p
            onClick={(e) => {
              if (e.target.getAttribute('key') === 'transfer') {
                this.transFormState(true);
              }
            }}
          >
            {_tHTML('activity.tansfer.help')}
          </p>
        </div>
        <AssetTransformPop
          allowClear={false}
          visible={visible}
          accountType="TRADE"
          onCancelCallback={this.afterSubmitCallback}
          afterSubmitCallback={this.afterSubmitCallback}
        />
      </div>
    );
  }
}
