/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { DialogWrapper, OverlayTitle, OverlayWrapper } from '../../I18nBox/styled';

const Dialog = (props) => {
  const { Title, modalVisible, closeModal, getLang, t } = props;

  return (
    <DialogWrapper
      maskClosable
      showCloseX
      footer={null}
      title={<Title />}
      size="large"
      open={modalVisible}
      onCancel={closeModal}
      className="Gbiz-I18nBox"
      data-inspector="inspector_i18n_dialog"
    >
      <OverlayWrapper>
        <OverlayTitle>{t('newheader.select.lang')}</OverlayTitle>
        {getLang()}
      </OverlayWrapper>
    </DialogWrapper>
  );
};

export default Dialog;
