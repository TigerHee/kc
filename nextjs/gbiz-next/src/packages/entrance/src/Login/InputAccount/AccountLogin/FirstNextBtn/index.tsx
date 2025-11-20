/**
 * Owner: sean.shi@kupotech.com
 */
import React from 'react';
import { Button } from '@kux/mui';
import { useLang } from '../../../../hookTool';
import styles from './index.module.scss';

interface FirstNextBtnProps {
  onClick?: () => void;
  loading?: boolean;
}

const FirstNextBtn: React.FC<FirstNextBtnProps> = ({ onClick, loading }) => {
  const { t } = useLang();

  return (
    <Button
      id="login_next_btn"
      className={styles.firstNextBtn}
      onClick={onClick}
      fullWidth
      size="large"
      loading={loading}
      data-inspector="signin_next_btn"
    >
      {t('next')}
    </Button>
  );
};

export default FirstNextBtn;
