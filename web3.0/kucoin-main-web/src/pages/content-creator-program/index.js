/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { useLocale } from '@kucoin-base/i18n';
import ContentCreatorPage from 'routes/ContentCreatorPage';

export default () => {
  useLocale();

  return <ContentCreatorPage />;
};
