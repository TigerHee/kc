/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import HOST from 'utils/siteConfig';
// import { ModalForbid } from '@remote/entrance';
import { useLocale } from '@kucoin-base/i18n';
import { ModalForbid } from '@kucoin-biz/entrance';

const Index = (props) => {
  const { onCancel = () => {} } = props || {};
  const { currentLang } = useLocale();

  return <ModalForbid onCancel={onCancel} currentLang={currentLang} HOST={HOST} />;
};

export default Index;
