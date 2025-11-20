import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import { CommunityProps } from './types';
import CommunityCard from './CommunityCard';
import CommunityList from './CommunityList';
import styles from './index.module.scss';
import { getSiteConfig } from 'kc-next/boot';
import { addLangToPath } from '@/tools/i18n';
import clsx from 'clsx';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';
import BackgroundEllipse from './BackgroundEllipse';
import { useCompliantShow } from 'gbiz-next/compliantCenter';
import { useConfigStore } from '@/store/config';
import { getTenantConfig } from '@/tenant';

const tenantConfig = getTenantConfig();

const Community: React.FC<CommunityProps> = ({ className }) => {
  const { t } = useTranslation();

  const showCommmnity = useCompliantShow('compliance.homepage.community.all');
  const configItems = useConfigStore(store => store.configItems);

  const { LANDING_HOST = '' } = getSiteConfig() || {};

  // 处理社群卡片点击
  const handleCommunityClick = () => {
    // 跳转到社群页面
    window.open(addLangToPath(`${LANDING_HOST}/community-collect`), '_blank');
  };

  // 处理客服卡片点击
  const handleCustomerServiceClick = () => {
    // 跳转到客服页面
    window.open(addLangToPath('/support'), '_blank');
  };

  // // todo: 通过读某个接口配置来控制卡片显示宽度
  // // 如果只有一个卡片，撑满宽度
  // const cardClassName = useMemo(() => {
  //   return communityPlatformGroups.length === 1 ? styles.singleCard : '';
  // }, [communityPlatformGroups.length]);

  const joinUsText = tenantConfig.joinUsText?.(t, {
    userCount: configItems?.webHomepageData?.backupValues?.GlobalInvestors,
    countryCount: configItems?.webHomepageData?.backupValues?.CountriesCovered,
  });

  return (
    <section className={clsx([styles.communityContainer, className])}>
      <div className={styles.contentContainer}>
        {/* 主标题 */}
        <AnimatedContent>
          <div className={styles.header}>
            <h2 className={styles.mainTitle}>{t('a3464d5a0fe64000a957')}</h2>
          </div>
        </AnimatedContent>

        {/* 卡片容器 */}
        <div className={styles.cardsContainer}>
          {/* 社群卡片 */}
          {showCommmnity && (
            <AnimatedContent delay={0.2} style={{ flex: 1 }}>
              <CommunityCard
                title={t('6d43cc25e78a4800a676')}
                description={joinUsText}
                buttonText={t('3264893a4a464800a0db')}
                buttonUrl={addLangToPath(`${LANDING_HOST}/community-collect`)}
                onClick={handleCommunityClick}
                extraNode={<CommunityList />}
              />
            </AnimatedContent>
          )}

          {/* 客服卡片 */}
          <AnimatedContent delay={0.4} style={{ flex: 1 }}>
            <CommunityCard
              className={clsx(styles.customerServiceCard, {
                [styles.fullWidth]: !showCommmnity,
              })}
              title={<div className={styles.customerTitle}>{t('715e0a6dd4644800a21c')}</div>}
              description={<div className={styles.textCenter}> {t('6646a0a9de644000a359')}</div>}
              onClick={handleCustomerServiceClick}
              buttonUrl={addLangToPath('/support')}
              afterNode={props => <BackgroundEllipse {...props} />}
            />
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
};

export default Community;
