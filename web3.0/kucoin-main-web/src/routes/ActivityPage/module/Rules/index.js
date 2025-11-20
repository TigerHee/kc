/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import BaseComponent from '../BaseComponent';
import Html from 'components/common/Html';
import { _t } from 'tools/i18n';
import style from './style.less';
import { useLocale } from '@kucoin-base/i18n';

export default ({ rule }) => {
  useLocale();
  return (
    <div className={style.rules}>
      <BaseComponent baseHead={_t('rules')}>
        <article>
          <Html>{rule}</Html>
        </article>
      </BaseComponent>
    </div>
  );
};
