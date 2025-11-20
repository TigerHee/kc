/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { searchToJson } from 'helper';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import styles from './style.less';

const videoKyc1 = 'https://assets.staticimg.com/static/KYC1.mp4';
const videoKyc2 = 'https://assets.staticimg.com/static/KYC2.mp4';

const Index = () => {
  const { video = 1 } = searchToJson();
  const src = Number(video) === 2 ? videoKyc2 : videoKyc1;

  return (
    <div className={styles.content}>
      <video inspector="video" controls autoPlay muted width="100%">
        <source src={src} type="video/mp4" />
        <track kind="captions" />
      </video>
    </div>
  );
};

export default brandCheckHoc(Index, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
