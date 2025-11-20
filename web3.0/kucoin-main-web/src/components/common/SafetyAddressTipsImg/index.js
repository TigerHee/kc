/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
// import { Modal, Input } from 'antd';
import { Dialog } from '@kc/mui';
import { _t } from 'tools/i18n';
import styles from './styles.less';
import { useLocale } from '@kucoin-base/i18n';

const SafetyAddressTipsImg = ({
  imgData,
  visible,
  onCancel,
  confirmOk,
  chainName,
  ...restProps
}) => {
  useLocale();
  return (
    <Dialog
      width={480}
      open={visible}
      onOk={confirmOk}
      onCancel={onCancel}
      destroyOnClose
      okText={_t('withdraw.safe.confirm.ok')}
      cancelText={_t('withdraw.safe.confirm.cancel')}
      className={styles.sa_modal}
      {...restProps}
    >
      <div className={styles.wrapper}>
        <h1 className={styles.title}>{_t('withdraw.safe.confirm')}</h1>
        <div className={styles.text}>{_t('withdraw.safe.confirm.notice')}</div>
        <div className={styles.img}>
          <img src={imgData} alt="safe img" style={{ width: '100%' }} />
        </div>
        <div className={styles.text}>
          {_t('withdraw.transfer.chain')}: {chainName}
        </div>
        <div className={styles.addressTipsNew}>{_t('withdraw.address.chain.tips4')}</div>
      </div>
    </Dialog>
  );
};

export default SafetyAddressTipsImg;
