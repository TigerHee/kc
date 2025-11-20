/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Button } from '@kux/mui';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import topbg from 'static/global/upgrade-modal-bg.png';
import { addLangToPath, _t } from 'tools/i18n';
import siteConfig from 'utils/siteConfig';
import {
  DialogDes,
  DialogTitle,
  LinkToSupport,
  MyDialogBody,
  MyDialogContent,
  Topbg,
} from './styled';

const { KUCOIN_HOST } = siteConfig;

const UpgradeModal = ({ content, maskClosable, onClose }) => {
  const handleUpgrade = useCallback(() => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/external/link?url=${KUCOIN_HOST}${addLangToPath('/download')}`,
      },
    });
  }, []);

  const handleClick = useCallback(() => {
    JsBridge.open({
      type: 'jump',
      params: {
        url: `/link?url=${KUCOIN_HOST}${addLangToPath('/support')}`,
      },
    });
  }, []);

  return (
    <MyDialogBody
      showCloseX={false}
      maskClosable={maskClosable}
      header={null}
      footer={null}
      open={true}
      size={'mini'}
      onCancel={onClose}
    >
      <Topbg src={topbg} alt="top-bg-img" />
      <MyDialogContent>
        <DialogTitle>{_t('support.upgrade.title')}</DialogTitle>
        {content || (
          <>
            <DialogDes>{_t('support.upgrade.description')}</DialogDes>
            <LinkToSupport onClick={handleClick}>{`${KUCOIN_HOST}/support`}</LinkToSupport>
          </>
        )}
        <Button onClick={handleUpgrade} size="large">
          {_t('support.upgrade.button')}
        </Button>
      </MyDialogContent>
    </MyDialogBody>
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
