/**
 * Owner: odan.ou@kupotech.com
 */

import React, { memo, useState } from 'react';
import { _t } from 'tools/i18n';
import proveImg from 'static/por/prove.svg';
import provePng from 'static/por/prove.png';
import styles from './intro.less';
import { useResponsive } from '@kux/mui/hooks';
import { useEffect } from 'react';

const Intro = () => {
  const [imgSrc, setImgSrc] = useState(provePng);
  const rv = useResponsive();
  useEffect(() => {
    if (rv.sm) {
      setImgSrc(proveImg);
    } else {
      setImgSrc(provePng);
    }
  }, [rv.sm]);
  return (
    <div className={`${styles.intro} intro_wrap`}>
      <div>
        <div className="intro_title">{_t('assets.por')}</div>
        <div className="intro_content">
          <div className="intro_text">{_t('assets.por.intro1')}</div>
          <div className="intro_text">{_t('assets.por.intro2')}</div>
          <div className="intro_text">{_t('assets.por.intro3')}</div>
        </div>
      </div>
      <div>
        <div className="intro_img">
          <img src={imgSrc} alt="intro_img" height={320} />
        </div>
      </div>
    </div>
  );
};

export default memo(Intro);
