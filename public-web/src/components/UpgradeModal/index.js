/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Button, Dialog } from '@kufox/mui';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import topbg from 'static/global/upgrade-modal-bg.png';
import { addLangToPath, _t } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
import styles from './styles.less';

const { KUCOIN_HOST } = siteConfig;

const UpgradeModal = ({ content, maskClosable, onClose }) => {
  const handleUpgrade = useCallback(() => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/external/link?url=${addLangToPath('https://www.kucoin.com/download')}`,
      },
    });
  }, []);

  const handleClick = useCallback(() => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${KUCOIN_HOST}/support`,
      },
    });
  }, []);

  return (
    <Dialog
      showCloseX={false}
      maskClosable={maskClosable}
      header={null}
      footer={null}
      open={true}
      size={'mini'}
      className={styles.myDialogBody}
      onCancel={onClose}
    >
      <img src={topbg} alt="" className={styles.topbg} />
      <div className={styles.myDialogContent}>
        <span className={styles.dialogTitle}>{_t('support.upgrade.title')}</span>
        {content || (
          <>
            <span className={styles.dialogDes}>{_t('support.upgrade.description')}</span>
            <span
              className={styles.linkToSupport}
              onClick={handleClick}
            >{`${KUCOIN_HOST}/support`}</span>
          </>
        )}
        <Button onClick={handleUpgrade}>{_t('support.upgrade.button')}</Button>
      </div>
    </Dialog>
  );
};

UpgradeModal.propTypes = {
  content: PropTypes.node,
  maskClosable: PropTypes.bool,
  onClose: PropTypes.func,
};

UpgradeModal.defaultProps = {
  content: undefined,
  maskClosable: false,
  onClose: () => {},
};

export default React.memo(UpgradeModal);
