/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, css } from '@kux/mui';
import { namespace } from '../model';
import { formatLangNumber } from '../common/tools';
import { useLang } from '../hookTool';
import { BASE_CURRENCY } from '../common/constants';
import { tenantConfig } from '../tenantConfig';

const useStyle = ({ theme }) => {
  return {
    vol: css({
      color: theme.colors.text,
      fontSize: 14,
      lineHeight: '130%',
      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
        marginTop: 4,
      },
    }),
    font: css({
      color: theme.colors.text40,
    }),
    label: css({
      marginRight: 10,
    }),
    unit: css({
      marginLeft: 10,
    }),
  };
};

export default function MarketsAmount(props) {
  const theme = useTheme();
  const { summary } = useSelector((state) => state[namespace]);
  const styles = useStyle({ theme });
  const { t } = useLang();
  const dispatch = useDispatch();
  const { currentLang } = props || {};

  useEffect(() => {
    dispatch({ type: `${namespace}/pullSummary` });
  }, []);

  if (!summary || !summary.TRADING_VOLUME || tenantConfig.hideFooterBaseVolAmount) {
    return null;
  }
  const baseVolAmount = summary.TRADING_VOLUME.amount;

  return (
    <div css={styles.vol} data-inspector="inspector_footer_markets_amount">
      <span css={[styles.label, styles.font]} className="label">
        24h {t('deal.vol')}
      </span>
      {formatLangNumber(baseVolAmount, currentLang)}
      <span css={[styles.unit, styles.font]} className="unit">
        {BASE_CURRENCY}
      </span>
    </div>
  );
}
