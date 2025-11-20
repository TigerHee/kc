/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Button, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import { InfoOutlined } from '@kufox/icons';

import { useTranslation } from '@tools/i18n';

const useStyle = ({ color }) => {
  return {
    root: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `,
    infoIcon: css`
      width: 46.7px;
      height: 46.7px;
    `,
    title: css`
      font-size: 24px;
      line-height: 36px;
      margin-top: 20.6px;
      font-weight: bold;
    `,
    des: css`
      font-size: 14px;
      line-height: 22px;
      margin-top: 8px;
      color: ${color.text60};
    `,
    button: css`
      width: 100%;
      margin-top: 120px;
    `,
  };
};

function DrawerPersonalInfo({ onCallback }) {
  const theme = useTheme();
  const styles = useStyle({ color: theme.colors });
  const { t: _t } = useTranslation();
  return (
    <div css={styles.root}>
      <InfoOutlined size="40" color={theme.colors.primary} />
      <div css={styles.title}>{_t('kyc.account.sec.review.passnot')}</div>
      <div css={styles.des}>{_t('kyc.account.sec.review.twice.passnot.info')}</div>
      <Button size="large" variant="contained" css={styles.button} onClick={onCallback}>
        {_t('kyc.account.sec.review.certificate.submit')}
      </Button>
    </div>
  );
}

export default DrawerPersonalInfo;
