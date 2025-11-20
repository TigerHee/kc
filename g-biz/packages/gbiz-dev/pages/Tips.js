/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { ModalForbid } from '@kc/entrance/lib/componentsBundle';

const Index = () => {
  return <ModalForbid currentLang="zh_CN" HOST={{ KUCOIN_HOST_CHINA: 'https://www.kucoin.io/' }} />;
};

export default Index;
