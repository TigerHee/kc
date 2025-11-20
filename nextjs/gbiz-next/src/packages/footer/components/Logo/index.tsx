import React from 'react';
import clsx from 'clsx';
import { queryPersistence } from 'tools/base/QueryPersistence';
import { WITHOUT_QUERY_PARAM } from 'packages/footer/config';
import { changLangToPath } from 'packages/footer/common/tools';
import LogoImg from 'packages/footer/static/logo.svg';
import styles from './styles.module.scss';
import { bootConfig } from 'kc-next/boot';

export default function FooterLogo({ KUCOIN_HOST }) {
  const brandLogo = bootConfig._BRAND_LOGO_ || LogoImg;

  return (
    <a
      href={changLangToPath(
        queryPersistence.formatUrlWithStore(KUCOIN_HOST, WITHOUT_QUERY_PARAM),
      )}
      className={clsx(styles.logo, 'logo')}
      aria-label="Kucoin logo (footer)"
    >
      <img src={brandLogo} alt={bootConfig._BRAND_SITE_ || 'KuCoin'} className={styles.img} />
    </a>
  );
}
