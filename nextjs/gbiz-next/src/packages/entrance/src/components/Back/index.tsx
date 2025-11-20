/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useLang } from '../../hookTool';
import styles from './index.module.scss';

interface BackProps {
  onBack?: () => void;
}

export const Back: React.FC<BackProps> = ({ onBack }) => {
  const { t } = useLang();
  return (
    <div className={clsx(styles.container)} onClick={onBack}>
      <ICArrowRight2Outlined size="16" />
      <span>{t('8RcupwHqYraGhrjT8kAzG7')}</span>
    </div>
  );
};

export default Back;