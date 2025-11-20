/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Content, DialogWrapper, OverlayTitle, OverlayWrapper } from './styled';

const types = ['lang', 'currency'];

const Dialog = (props) => {
  const { Title, modalVisible, closeModal, tab, getCurrency, getLang, t } = props;

  console.log('==== trunkLoaded i18nbox');

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
      {tab === types[0] ? (
        <OverlayWrapper>
          <OverlayTitle>{t('newheader.select.lang')}</OverlayTitle>
          {getLang()}
        </OverlayWrapper>
      ) : (
        <OverlayWrapper>
          <OverlayTitle>{t('newheader.select.currency')}</OverlayTitle>
          <Content>{getCurrency()}</Content>
        </OverlayWrapper>
      )}
    </DialogWrapper>
  );
};

export default Dialog;
