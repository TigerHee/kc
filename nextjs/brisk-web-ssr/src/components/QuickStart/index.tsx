import React from 'react';
import useTranslation from '@/hooks/useTranslation';
import styles from './index.module.scss';
import GuidanceButton from '../CommonComponents/GuidanceButton';
import { PositionType } from '../CommonComponents/GuidanceButton/types';
import { getTenantConfig } from '@/tenant';

const QuickStart: React.FC = () => {
  const { Trans } = useTranslation();
  const tenantConfig = getTenantConfig();

  return (
    <section className={styles.quickStartContainer}>
      <div className={styles.quickStartBox}>
        {tenantConfig.showAllSlogans && (
          <div className={styles.text}>
            <Trans i18nKey={tenantConfig.sloganTitleKey} components={{ span: <span /> }} />
          </div>
        )}
        <div className={styles.buttonBox}>
          <GuidanceButton positionType={PositionType.QuickStart} />
        </div>
      </div>
    </section>
  );
};

export default QuickStart;
