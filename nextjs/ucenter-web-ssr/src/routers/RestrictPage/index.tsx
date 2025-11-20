/**
 * Owner: tiger@kupotech.com
 */
import { bootConfig } from 'kc-next/boot';
import JsBridge from 'gbiz-next/bridge';
import useTheme from '@/hooks/useTheme';
import useTranslation from '@/hooks/useTranslation';
import { useEffect, useMemo } from 'react';
import Skeleton from '@/components/Skeleton';
import { reportRestrictMismatch } from '@/core/telemetryModule';
import { addLangToPath } from '@/tools/i18n';
import errorDrakImg from './img/dialog-warn-info-dark.png';
import errorImg from './img/dialog-warn-info.png';
import styles from './styles.module.scss';
import searchToJson from '@/utils/searchToJson';

interface RestrictPageProps {
  query?: Record<string, string>;
}

const RestrictPage = ({ query: queryProps }: RestrictPageProps) => {
  const isInApp = JsBridge.isApp();

  const query = queryProps || searchToJson();

  const { t: _t, Trans } = useTranslation();
  const { theme } = useTheme();

  const restrictDescInfo = useMemo(() => {
    const info = {
      CN: {
        title: <h3 className={styles.title}>重要提示</h3>,
        description: (
          <>
            {query?.ip ? (
              <div className={styles.ipBox} data-inspector="inspector_cdn_restrict_IP">
                当前IP:&nbsp;
                <span>{query?.ip}</span>
              </div>
            ) : null}
            <p className={styles.desc} data-inspector="inspector_cdn_restrict_cn">
              檢測到您當前IP所在地來自<strong>中国大陆地区</strong>，根據當地
              <strong>法律法規及政策</strong>，我們<strong>無法為您提供服務</strong>
              ，很抱歉為您帶來不便。
            </p>
            <p className={styles.desc}>
              如您非該地區使用者，請在非服務受限區域使用我們的平臺，並通過KYC認證確認您的國籍身份。
            </p>
          </>
        ),
      },
      'US-NY': {
        title: <h3 className={styles.title}>{_t('w6H4ziWz2Bkd4pfxz1HuHP')}</h3>,
        description: (
          <>
            {query?.ip ? (
              <div className={styles.ipBox} data-inspector="inspector_cdn_restrict_IP">
                {_t('api.ip.current')}&nbsp;
                <span>{query?.ip}</span>
              </div>
            ) : null}
            <p className={styles.desc} data-inspector="inspector_cdn_restrict_us-ny">
              <Trans i18nKey="9JxM4gSiDTfoVk6F5aWhFo" components={{ strong: <strong /> }} />
            </p>
            <p className={styles.desc}>{_t('jTFATagnR2TJCyU7ZRg3U8')}</p>
          </>
        ),
      },
      PAGE_COMPLIANCE: {
        title: <h3 className={styles.title}>{_t('51e9299bf1b04000a1c3')}</h3>,
        description: (
          <>
            {query?.ip ? (
              <div className={styles.ipBox} data-inspector="inspector_cdn_restrict_IP">
                {_t('api.ip.current')}&nbsp;
                <span>{query?.ip}</span>
              </div>
            ) : null}
            <p className={styles.desc} data-inspector="inspector_cdn_restrict_PAGE_COMPLIANCE">
              <Trans i18nKey="ef98f0b590b24000a420" components={{ strong: <strong /> }} />
            </p>
            <p className={styles.desc}>{_t('c280920c99cc4000afb8')}</p>
          </>
        ),
      },
      CDN_FORBIDDEN: {
        title: <h3 className={styles.title}>{_t('w6H4ziWz2Bkd4pfxz1HuHP')}</h3>,
        description: (
          <>
            {query?.ip ? (
              <div className={styles.ipBox} data-inspector="inspector_cdn_restrict_IP">
                {_t('api.ip.current')}&nbsp;
                <span>{query?.ip}</span>
              </div>
            ) : null}
            <p className={styles.desc} data-inspector="inspector_cdn_restrict_CDN_FORBIDDEN">
              {_t('cdn.forbidden.content')}
            </p>
          </>
        ),
      },
    };

    return query?.code ? info[query?.code] || {} : {};
  }, [query?.ip, query?.code]);

  useEffect(() => {
    if (!restrictDescInfo.title) {
      reportRestrictMismatch(query?.code);
    }
  }, []);

  useEffect(() => {
    // 显示header, 防止其他页面导航过来后，header可能没有
    // 比如A页面设置不显示header，因为一些原因需要重定向到本页面，本页面是需要显示header的
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          visible: true,
        },
      });
    }
  }, [isInApp]);

  return (
    <section data-inspector="restrict_page">
      <div className={styles.pageHeader}>
        {isInApp ? (
          <img alt="logo" className={styles.logo} src={bootConfig._BRAND_LOGO_} />
        ) : (
          <a className={styles.logoWrapper} href={addLangToPath('/')} rel="noopener noreferrer">
            <img alt="logo" className={styles.logo} src={bootConfig._BRAND_LOGO_} />
          </a>
        )}
      </div>

      <div className={styles.mainContent}>
        <img
          className={styles.errorImg}
          src={theme === 'dark' ? errorDrakImg : errorImg}
          alt="error-icon"
        />

        {!restrictDescInfo.title && (
          <div className={styles.skeletonWrapper}>
            <Skeleton margin="0 0 24px 0" height="36px" width="40%" />
          </div>
        )}
        {!restrictDescInfo.description && <Skeleton margin="0 0 24px 0" />}
        {!restrictDescInfo.description && <Skeleton height="78px" />}

        {restrictDescInfo.title}
        {restrictDescInfo.description}
      </div>
    </section>
  );
};

export default RestrictPage;
