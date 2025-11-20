/**
 * Owner: sean.shi@kupotech.com
 */
import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import clsx from 'clsx';
import { pull } from 'tools/request';
import { bootConfig } from 'kc-next/boot';
import storage from 'tools/storage';
import { Trans } from 'tools/i18n';
import useMultiSiteConfig from 'hooks/useMultiSiteConfig';
import { useCompliantShowWithInit } from 'packages/compliantCenter';
import { getTenantConfig } from '../../../config/tenant';
import {
  SIGNUP_INDIA_REGISTRATION_SPM,
  SIGNUP_LEADING_CRYTO_CURRENCY_EXCHAGED_SPM,
  SIGNUP_PREFERRED_PROFESSIONALS_SPM,
  SIGNUP_REGISTRATION_REWARD_SPM,
} from '../../../common/constants';
import { useLang, useHtmlToReact } from '../../../hookTool';
import { dateTimeFormat, divide } from '../../../common/tools';
import banner1 from '../../../../static/reg_left_banner_1.png';
import banner1Dark from '../../../../static/reg_left_banner_1_dark.png';
// import banner2 from '../../../../static/reg_left_banner_2.png';
// import banner2Dark from '../../../../static/reg_left_banner_2_dark.png';
import btcIcon from '../../../../static/reg_left_btc.png';
import btcIconDark from '../../../../static/reg_left_btc_dark.png';
import ethIcon from '../../../../static/reg_left_eth.png';
import ethIconDark from '../../../../static/reg_left_eth_dark.png';
import usdtIcon from '../../../../static/reg_left_usdt.png';
import usdtIconDark from '../../../../static/reg_left_usdt_dark.png';
import indiaTempDarkImg from '../../../../static/india-temp-dark.png';
import indiaTempLightImg from '../../../../static/india-temp-light.png';

import skeletonDark from '../../../../static/sign_dark.png';
import skeletonLight from '../../../../static/sign_light.png';

import styles from './index.module.scss';

type ReserveAsset = {
  currency: string;
  reserveRate: number;
};

export interface SignupBenefitsProps {
  showMktContent?: boolean;
}

export const SignupBenefits = (props: SignupBenefitsProps) => {
  const { showMktContent } = props;
  const [assetReserve, setAssetReserve] = useState<{
    latestAuditDate: number | null;
    reserveAsset: ReserveAsset[];
  }>({ latestAuditDate: null, reserveAsset: [] });
  const [guideTextJson, setGuideTextJson] = useState<any>(null);
  const theme = useTheme();
  const { t: _t } = useLang();
  const currentLang = storage.getItem('kucoinv2_lang');
  const { multiSiteConfig } = useMultiSiteConfig();

  // 只用一个 init 就可以了
  const { show: showIndiaRegistration, init: compliantInit } = useCompliantShowWithInit(SIGNUP_INDIA_REGISTRATION_SPM);
  const { show: showRegistrationReward } = useCompliantShowWithInit(SIGNUP_REGISTRATION_REWARD_SPM);
  const { show: showPreferredProfessionals } = useCompliantShowWithInit(SIGNUP_PREFERRED_PROFESSIONALS_SPM);
  const { show: showLeadingCyptocurrencyExchange } = useCompliantShowWithInit(SIGNUP_LEADING_CRYTO_CURRENCY_EXCHAGED_SPM);

  const { showGlobalSiteContent } = getTenantConfig().signup;

  const guideTextDesc = useHtmlToReact({
    html: guideTextJson?.backupValues?.firstWindowDscA?.replace('\n', '<br>'),
  });

  const rowItemLeft = useMemo(() => {
    return (
      <>
        <h3 className={clsx(styles.baseTitle, styles.rowItemTitle1)}>
          {guideTextJson ? guideTextJson?.backupValues?.firstWindowTitleA : null}
        </h3>
        {guideTextJson ? (
          <p className={clsx(styles.baseDesc, styles.rowItem1Desc)} style={{ marginBottom: 4 }}>
            {guideTextDesc.eles ? guideTextDesc.eles : null}
          </p>
        ) : null}
      </>
    );
  }, [guideTextJson, guideTextDesc]);

  const showRowItem1 = useMemo(() => {
    return (
      guideTextJson?.backupValues?.firstWindowTitleA &&
      guideTextJson?.backupValues?.firstWindowDscA &&
      multiSiteConfig?.registerConfig?.supportRegisterGuide
    );
  }, [
    guideTextJson?.backupValues?.firstWindowDscA,
    guideTextJson?.backupValues?.firstWindowTitleA,
    multiSiteConfig?.registerConfig?.supportRegisterGuide,
  ]);

  const isHiddenMktContent = useMemo(() => {
    return !showRegistrationReward || !showRowItem1 || !showMktContent;
  }, [showRegistrationReward, showRowItem1, showMktContent]);

  const CoinIcons = useMemo(() => {
    return theme?.currentTheme === 'dark'
      ? { BTC: btcIconDark, ETH: ethIconDark, USDT: usdtIconDark }
      : { BTC: btcIcon, ETH: ethIcon, USDT: usdtIcon };
  }, [theme]);

  useEffect(() => {
    const getAssetReserve = async () => {
      const cache = storage.getItem('kucoinv2_cache_assetReserve');
      if (cache && +cache.expireTime > Date.now()) {
        setAssetReserve(cache.data);
      } else {
        const { data } = await pull('/asset-front/proof-of-reserves/asset-reserve');
        if (data) {
          const minifyData = {
            latestAuditDate: data.latestAuditDate,
            reserveAsset: (data.reserveAsset || []).map((i: any) => ({
              currency: i.currency,
              reserveRate: i.reserveRate,
            })),
          };
          storage.setItem('kucoinv2_cache_assetReserve', {
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            data: minifyData,
          });
          setAssetReserve(minifyData);
        }
      }
    };
    getAssetReserve();
  }, []);

  useEffect(() => {
    async function fetchGuideText() {
      try {
        const { data } = await pull('/growth-config/get/client/config/codes', {
          businessLine: 'ucenter',
          codes: 'web202312homepagePop',
        });
        if (data?.properties?.[0]?.backupValues) {
          setGuideTextJson(data.properties[0]);
        }
      } catch (error) {
        console.error('getRegGuideTextApi failed:', error);
      }
    }
    if (!guideTextJson) {
      fetchGuideText();
    }
  }, [guideTextJson]);

  // 如果展业规则请求完成了，就展示内容；否则展示骨架屏；
  const isShowSkeleton = useMemo(() => {
    if (compliantInit) {
      return false;
    }
    return true;
  }, [compliantInit]);

  if(isShowSkeleton) {
    return (
      <div className={clsx(styles.container, styles.skeletonWrapper)}>
        <img
          src={theme?.currentTheme === 'dark' ? skeletonDark : skeletonLight}
          alt="skeleton"
          className={styles.skeletonImg}
          fetchPriority="high"
        />
      </div>
    )
  }


  return (
    <div className={styles.container}>
      {showIndiaRegistration && (
        <>
          <div className={clsx(styles.row, styles.topRowItem)} data-inspector="signup_left_india_module">
            <div>
              <h3 className={clsx(styles.baseTitle, styles.rowItemTitle1)}>{_t('4e3f3d75635a4000adbb')}</h3>
              <p className={clsx(styles.baseDesc, styles.rowItem1Desc)}>{_t('a51f9862bbbd4000ac6d')}</p>
            </div>
            {/* <div>
              <img
                className={styles.indiaTempImg}
                src={theme?.currentTheme === 'dark' ? indiaTempDarkImg : indiaTempLightImg}
              />
            </div> */}
          </div>
          <div className={styles.rowItemDivider} style={{ margin: '0 0 32px' }} />
        </>
      )}

      {isHiddenMktContent ? null : (
        <>
          <div className={clsx(styles.row, styles.rowItem1)} data-inspector="signup_left_mtk_content">
            <div>{rowItemLeft}</div>
            <div>
              <img
                className={styles.rowItemImg1}
                data-inspector="signup_left_top_img"
                src={theme?.currentTheme === 'dark' ? banner1Dark : banner1}
              />
            </div>
          </div>
          <div className={styles.rowItemDivider} style={{ margin: '0 0 32px' }} />
        </>
      )}

      {!showPreferredProfessionals || !showGlobalSiteContent ? null : (
        <>
          <div className={clsx(styles.row, styles.rowItem2)} data-inspector="signup_left_text1">
            <div className={styles.rowItemLeft}>
              <h3 className={clsx(styles.baseTitle, styles.rowItemTitle2)}>{_t('hVsbkgkbhwdppgSy7pTxfj')}</h3>
              <div className={styles.numberItemBox}>
                <div className={styles.numberItem}>
                  <h5 className={styles.numberItemText}>&gt; {numberFormat({ number: 200, lang: currentLang })}</h5>
                  <p className={styles.numberItemDesc}>{_t('nX2fKNob7ET9YF9sajDb7u')}</p>
                </div>
                <div className={styles.numberItemDivider} />
                <div className={styles.numberItem}>
                  <h5 className={styles.numberItemText}>&gt; {numberFormat({ number: 1300, lang: currentLang })}</h5>
                  <p className={styles.numberItemDesc}>{_t('9cxpApngg3RP4p3hMGVnEx')}</p>
                </div>
                <div className={styles.numberItemDivider} />
                <div className={styles.numberItem}>
                  <h5 className={styles.numberItemText}>&gt; {numberFormat({ number: 200, lang: currentLang })}</h5>
                  <p className={styles.numberItemDesc}>{_t('8ZsPNXRXwYTbMgkHyeMsFi')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rowItemDivider} />
        </>
      )}

      {showGlobalSiteContent && assetReserve?.latestAuditDate && assetReserve?.reserveAsset?.length > 0 && (
        <div className={clsx(styles.row, styles.rowReserveAsset)} data-inspector="signup_left_reserve">
          <div className={styles.rowItemLeft}>
            <h3 className={clsx(styles.baseTitle, styles.rowReserveAssetTitle)}>{_t('xpLffZDFSrbRjM7atbF9Rd')}</h3>
            <p className={styles.rowReserveAssetDesc}>
              {_t('mfGj3qAfyLXZZFUkxonUUu', {
                dateTime: dateTimeFormat({
                  currentLang,
                  children: assetReserve?.latestAuditDate as any,
                  options: { timeZone: 'Asia/Shanghai' },
                }),
              })}
            </p>
            <div className={styles.coinItemBox}>
              {['BTC', 'ETH', bootConfig._BASE_CURRENCY_].map(i => {
                const one = assetReserve?.reserveAsset?.find(k => k.currency === i);
                if (one && one.currency && (CoinIcons as any)[one.currency]) {
                  const rateVal = one.reserveRate
                    ? numberFormat({
                      options: { style: 'percent', maximumFractionDigits: 2 },
                      number: divide(one.reserveRate, 100),
                      lang: currentLang,
                      isPositive: true,
                    })
                    : '--';
                  return (
                    <div className={styles.coinItem} key={i}>
                      <img className={styles.coinItemIcon} src={(CoinIcons as any)[one.currency]} />
                      <div className={styles.coinItemText}>{rateVal}</div>
                      <div className={styles.coinItemDesc}>
                        {_t('kSkeCA74e5bA2ariLPsYb6', {
                          currency: one.currency,
                        })}
                      </div>
                    </div>
                  );
                }
                return <div className={clsx(styles.coinItem, styles.placeholder)} key={i} />;
              })}
            </div>
          </div>
        </div>
      )}

      {!showLeadingCyptocurrencyExchange || !showGlobalSiteContent ? null : (
        <>
          <div className={styles.rowItemDivider} />
          <div className={clsx(styles.row, styles.rowItem4)} data-inspector="signup_left_text2">
            <div className={styles.rowItemLeft}>
              <h3 className={clsx(styles.baseTitle, styles.rowItemTitle4)}>{_t('c3SRHUWaJViVLvkdD4mvk3')}</h3>
              <p className={styles.baseDesc} style={{ marginBottom: 4 }}>
                <Trans
                  i18nKey="8oU6QF41UPsPzAWSZGzcUb"
                  ns="entrance"
                  components={{
                    span: <span className="highlight" />,
                  }}
                />
              </p>
              <p className={styles.baseDesc}>
                <Trans
                  i18nKey="8gXdRQpQ1EYdPruAyzsuGb"
                  ns="entrance"
                  components={{
                    span: <span className="highlight" />,
                  }}
                />
              </p>
            </div>
            {/* <div className={styles.rowItemRight}>
              <img className={styles.rowItemImg2} src={theme?.currentTheme === 'dark' ? banner2Dark : banner2} />
            </div> */}
          </div>
        </>
      )}

      {multiSiteConfig?.registerConfig?.registerPageContextUrl && getTenantConfig().signup.isShowRegisterImg ? (
        <div className={styles.imageWrapper}>
          <img src={multiSiteConfig?.registerConfig?.registerPageContextUrl} alt="site-register-img" />
        </div>
      ) : null}
    </div>
  );
};

export default SignupBenefits;
