import React from 'react';
import styles from './styles.module.scss';
import { Collapse } from '@kux/design';
import useTranslation from '@/hooks/useTranslation';
import { getTenantConfig } from '@/tenant';
import { useConfigStore } from '@/store/config';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';

const FAQ = () => {
  const { t } = useTranslation();
  const configItems = useConfigStore(store => store.configItems);
  const tenantConfig = getTenantConfig();

  const list = [
    {
      content: t('2ce5436ed2194000a6b5'),
      key: '1',
      title: <AnimatedContent delay={0.2}>{t('646b3b3b23ef4000a158')}</AnimatedContent>,
    },
    {
      content: t('30241f09943e4800afa3'),
      key: '2',
      title: <AnimatedContent delay={0.4}>{t('451e2c4e4e594800a4db')}</AnimatedContent>,
    },
    {
      content: t('ab2d45d1d6794800abca'),
      key: '3',
      title: <AnimatedContent delay={0.6}>{t('7b1095eda5324800ac3b')}</AnimatedContent>,
    },
    {
      content: tenantConfig.faqDescription(t, {
        userCount: configItems?.webHomepageData?.backupValues?.GlobalInvestors,
        coinCount: configItems?.webHomepageData?.backupValues?.Coins,
      }),
      key: '4',
      title: <AnimatedContent delay={0.8}>{tenantConfig.faqTitle(t)}</AnimatedContent>,
    },
  ];

  return (
    <section className={styles.container}>
      <AnimatedContent>
        <h2 className={styles.title}>{t('9fbbd6c08f564000a025')}</h2>
      </AnimatedContent>
      <AnimatedContent delay={0.2}>
        <Collapse items={list} />
      </AnimatedContent>
    </section>
  );
};

export default FAQ;
