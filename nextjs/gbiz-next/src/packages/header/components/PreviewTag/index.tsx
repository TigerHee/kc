/**
 * Owner: roger@kupotech.com
 */
import React, { FC } from 'react';
import { useTranslation } from 'tools/i18n';
import styles from './styles.module.scss'


const Tag: FC = () => {
    const { t } = useTranslation('header');
    return <span className={styles.previewTag}>{t('sMUjriV7ZakUsQWbw49gp7')}</span>;
};

export default Tag;
