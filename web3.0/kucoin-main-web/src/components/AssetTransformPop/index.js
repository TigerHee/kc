/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { Modal } from '@kc/ui';
import AssetTransForm from './Form';
import style from './style.less';
import { injectLocale } from '@kucoin-base/i18n';

@injectLocale
export default class AssetTransformPop extends React.Component {
  render() {
    const { visible, onCancelCallback } = this.props;
    return (
      <Modal
        visible={visible}
        className={style.modal}
        width="400px"
        footer={null}
        title={_t('transfer')}
        destroyOnClose
        onCancel={onCancelCallback}
      >
        <AssetTransForm {...this.props} />
      </Modal>
    );
  }
}
