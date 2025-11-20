/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2023-06-15 10:42:38
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-05-26 16:47:57
 * @FilePath: /kucoin-main-web/src/pages/careers/index.js
 * @Description: 
 * 
 * 
 */

import React, { useEffect } from 'react';
import JoinUsPage from 'routes/JoinUsPage';
import { useLocale } from '@kucoin-base/i18n';
import 'animate.css';
import { WOW } from 'wowjs';
import { TipProvider, TipDialog, useTipDialogStore } from 'components/JoinUs/TipDialog';

export default () => {
  useLocale();
  useEffect(() => {
    new WOW({ offset: 10 }).init();
  }, []);
  return (
    <TipProvider>
      <JoinUsPage />
    </TipProvider>
  );
};
