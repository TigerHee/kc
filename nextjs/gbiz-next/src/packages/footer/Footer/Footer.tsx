/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useResponsive } from '@kux/mui-next';
import MarketsAmount from '../components/MarketsAmount';
import ServerTime from '../components/ServerTime';
import FooterLogo from '../components/Logo';
import CmsLinks from '../components/CmsLinks';
import { getTenantConfig } from '../tenantConfig';
import styles from './styles.module.scss';
import commonStyles from '../components/styles.module.scss';
import { bootConfig, getSiteConfig } from 'kc-next/boot';
import { useTranslation } from 'tools/i18n';

export default function Footer(props) {
  const {
    styleConfig = {},
    theme
  } = props;
  const tenantConfig = getTenantConfig(bootConfig._BRAND_SITE_);
  const { KUCOIN_HOST } = getSiteConfig();
  const rv = useResponsive();
  const { t } = useTranslation('footer');
  const disclaimerDesc = tenantConfig.disclaimerDesc(t);
  const highRiskDesc = tenantConfig.highRiskDesc(t);

  useEffect(() => {
    const nodes = document.querySelectorAll('.newFooterLinkGroupTitle');
    nodes.forEach((node, idx) => {
      if (idx !== nodes.length - 1) {
        if (node.className.includes(commonStyles.after)) {
          node.className = node.className.replace(commonStyles.after, '');
        }
        const sibs = node!.parentNode!.childNodes;
        sibs.forEach((sib: any, index) => {
          if (sib.nodeType === 1 && index !== 0) {
            if (rv.sm) {
              sib.style.display = 'block';
            } else {
              sib.style.display = 'none';
            }
          }
        });
      }
    });
  }, [rv]);

  return (
    <div className={styles.cFooter} style={{ ...styleConfig }} data-theme={theme}>
      <footer className={clsx(styles.footerMain, 'footerMain')}>
        <FooterLogo KUCOIN_HOST={KUCOIN_HOST} />
        <CmsLinks {...props} />
        {/* 泰国站风险声明 */}
        {highRiskDesc ? <div className={styles.highRiskDesc}>{highRiskDesc}</div> : null}
        <div className={clsx(styles.divider, 'divider')} />
        {disclaimerDesc ? <div className={styles.disclaimerDesc}>{disclaimerDesc}</div> : null}
        <div
          className={clsx('copyright', {
            [styles.copyrightOneCol]: !(tenantConfig?.showServeTime),
            [styles.copyright]: tenantConfig?.showServeTime,
            [styles.smCopyRight]: tenantConfig?.showServeTime,
          })}
        >
          <small
            className={clsx('new-copyright', styles.newCopyright)}
            data-inspector="inspector_footer_copyright"
          >
            {tenantConfig?.copyrightText}
          </small>
          {tenantConfig?.showServeTime ? (
            <div className={clsx('servertime',styles.servertime, styles.smCopyRight)}>
              <ServerTime {...props} />
              {tenantConfig?.showMarketsAmount ? <MarketsAmount {...props} /> : null}
            </div>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
