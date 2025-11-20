/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { useTheme } from '@kufox/mui';
import clxs from 'classnames';
import { _t } from 'tools/i18n';
import NotFoundSvg from 'static/spotNFT/notFound.svg';
import NotFoundInDarkSvg from 'static/spotNFT/notFoundInDark.svg';

import style from './style.less';

const NotFound = () => {
  const theme = useTheme();
  const { currentTheme } = theme;
  const darkTheme = currentTheme === 'dark';
  return (
    <div className={style.container}>
      <div className={style.imgContainer}>
        <img src={darkTheme ? NotFoundInDarkSvg : NotFoundSvg} alt="" />
      </div>
      <div className={clxs(style.note, { [style.noteInDark]: darkTheme })}>
        {_t('igo.nft.collection.notFound')}
      </div>
    </div>
  );
};

export default NotFound;
