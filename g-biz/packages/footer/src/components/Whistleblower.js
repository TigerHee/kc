import React from 'react';
import { useTheme, css } from '@kux/mui';
import { Trans } from '@tools/i18n';
import { useLang } from '../hookTool';
import { useCommonStyles } from './commonStyles';
import { tenantConfig } from '../tenantConfig';

const useStyles = ({ theme }) => {
  return {
    tipOffMenu: css({
      padding: '12px 16px',
      left: '120px !important',
      wordBreak: 'break-word',
      '&::after': {
        left: 30,
        '[dir="rtl"] &': {
          left: 'unset',
          right: 30,
        },
      },
    }),
    ol: css({
      listStyle: 'none',
    }),
    tipOffMenuTitle: css({
      fontWeight: '500',
      fontSize: 14,
      lineHeight: '22px',
      color: theme.colors.text,
      marginBottom: 4,
    }),
    tipOffMenuItem: css({
      fontSize: 12,
      lineHeight: '20px',
      color: theme.colors.text60,
    }),
    tipOffMenuTip: css({
      marginTop: 14,
    }),
    tipOffMenuMail: css({
      fontSize: 12,
      lineHeight: '20px',
      color: theme.colors.text,
      'a': {
        display: 'inline',
        fontSize: 12,
        padding: 0,
        color: theme.colors.primary,
        height: 'unset',
        lineHeight: 'unset',
      },
    }),
  };
};

export default function Whistleblower() {
  const { t } = useLang();
  const theme = useTheme();
  const commonStyles = useCommonStyles({ theme });
  const styles = useStyles({ theme });

  return (
    <dd
      css={commonStyles.newFooterHover}
      className="newFooterHover"
      data-inspector="inspector_footer_Whistleblower"
    >
      {t('bZMWZGPy2x9wj5DcBZrK8F')}
      <section
        css={[commonStyles.newFooterHoverMenu, styles.tipOffMenu]}
        className="newFooterHoverMenu tipOffMenu"
        data-inspector="inspector_footer_Whistleblower_children"
      >
        <h4 css={styles.tipOffMenuTitle} className="tipOffMenuTitle">
          {t('sDbPTgLT7QGMB98z9wx2mS')}
        </h4>
        <ol css={styles.ol}>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('wUdMNPE5z95BXX7Rk2BBCk')}
          </li>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('4cDGVqYyRpReHGPohUaALn')}
          </li>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('azNUD4jMbQgfAx9rd2sAEv')}
          </li>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('eWa64H5uyCLcziSxe2vdag')}
          </li>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('nExX7SCrWwpFnVmRhzNoMe')}
          </li>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('9ZTt4FN8zv9inucjZ8qvYr')}
          </li>
          <li css={styles.tipOffMenuItem} className="tipOffMenuItem">
            {t('iaqRMs87HVN2jVqGmB7tPy')}
          </li>
        </ol>
        <p
          css={[styles.tipOffMenuItem, styles.tipOffMenuTip]}
          className="tipOffMenuItem tipOffMenuTip"
        >
          {t('k9Z4VAFxRpoTv5NAJ48V3U')}
        </p>
        <p css={styles.tipOffMenuMail} className="tipOffMenuMail">
          <Trans
            i18nKey="gq4xUyim65HHE3swndoYW5"
            ns="footer"
            values={{ email: tenantConfig.email }}
          >
            舉報郵箱：
            <a target="_blank" rel="noopener noreferrer nofollow" href={`mailto:${tenantConfig.email}`}>
              email
            </a>
          </Trans>
        </p>
      </section>
    </dd>
  );
}
