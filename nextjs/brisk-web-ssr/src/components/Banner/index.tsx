import React, { useEffect } from 'react';
import BackgroundContainer from './BackgroundContainer';
import useTranslation from '@/hooks/useTranslation';
import styles from './index.module.scss';
import AnimatedContent from '@/components/CommonComponents/Animations/AnimatedContent';

import BannerQrCode from './BannerQrCode';
import { useUserStore } from '@/store/user';
import { saTrackForBiz } from '@/tools/ga';
import GuidanceButton from '../CommonComponents/GuidanceButton';
import { useCompliantShow } from 'gbiz-next/compliantCenter';
import { getTenantConfig } from '@/tenant';
import WatchFilmButton from './WatchFilmButton';
import clsx from 'clsx';

const Banner: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { pullKycStatus, pullBalanceInfo, pullUserTradeStatus } = useUserStore();
  const tenantConfig = getTenantConfig();

  const showBannerSlogan = useCompliantShow('compliance.homepage.banner.slogan');
  const isLogin = useUserStore(state => state.isLogin);
  const hasTrade = useUserStore(state => state.hasTrade);
  const totalAssets = useUserStore(state => state.totalAssets) || 0;
  const hasBalance = totalAssets > 0;

  const kycStatusInfo = useUserStore(state => state.kycStatusInfo);
  const loading = kycStatusInfo === undefined || totalAssets === undefined || hasTrade === undefined;

  useEffect(() => {
    if (isLogin) {
      pullKycStatus();
      pullUserTradeStatus();
      pullBalanceInfo();
    }
  }, [isLogin]);

  useEffect(() => {
    if (isLogin && !loading) {
      saTrackForBiz({}, ['headGuide', '1'], {
        contentType: !hasBalance ? 'goBuy' : !hasTrade ? 'goTrade' : 'normal',
      });
    }
  }, [hasBalance, hasTrade, isLogin, loading]);

  const isShowFilm = !isLogin && tenantConfig.showFilmEntry;

  return (
    <BackgroundContainer>
      <div className={styles.sloganBox}>
        {tenantConfig.showAllSlogans && (
          <>
            <AnimatedContent delay={0}>
              <h1 className={styles.title}>
                <Trans i18nKey={tenantConfig.sloganTitleKey} components={{ span: <span /> }} />
              </h1>
            </AnimatedContent>

            <AnimatedContent delay={0.3} style={{ visibility: `${showBannerSlogan ? 'visible' : 'hidden'}` }}>
              <div className={styles.subtitle}>{t(tenantConfig.sloganSubTitleKey)}</div>
            </AnimatedContent>
          </>
        )}

        <AnimatedContent delay={0.6}>
          <div
            className={clsx({
              [styles.actionBox]: true,
              [styles.showFilmButton]: isShowFilm,
            })}
          >
            <GuidanceButton />
            {isShowFilm ? (
              <div className={styles.filmAndQrCodeBox}>
                <WatchFilmButton />
                <BannerQrCode />
              </div>
            ) : (
              <BannerQrCode />
            )}
          </div>
        </AnimatedContent>
      </div>
    </BackgroundContainer>
  );
};

export default Banner;
