/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { Button, DateTimeFormat, NumberFormat } from '@kux/mui';
import { memo, useCallback } from 'react';
import hotSvg from 'static/votehub/hot.svg';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { push } from 'utils/router';
import Tooltip from '../../../components/Tooltip';
import { useResponsiveSize } from '../../../hooks';
import { SymbolInfo } from '../ProjectCard';
import { ActiveTitle, StyledCard, SymbolInfoButton, SymbolInfoHot } from './styledComponents';

/**
 * 项目卡票
 * @param {logoUrl} 项目图片 required
 * @param {activityName} 活动名称 required
 * @param {name} 项目名称 required
 * @param {subName} 项目简称 required
 * @param {date} 获胜时间
 * @param {hot} 项目热度（票数）
 * @param {symbol} 交易按钮
 * @returns
 */
function HistoryProjectCard({ logoUrl, activityName, name, subName, hot, date, symbol }) {
  const isInApp = JsBridge.isApp();
  const { currentLang } = useLocale();
  const size = useResponsiveSize();

  const handle2Trade = useCallback(() => {
    trackClick(['history', 'trade'], {
      currency: symbol,
    });
    if (isInApp) {
      // app内跳转
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/trade?symbol=${symbol}&goBackUrl=${encodeURIComponent(window.location.href)}`,
        },
      });
    } else {
      push(`/trade/${symbol}`);
    }
  }, [symbol, isInApp]);

  return (
    <StyledCard>
      <ActiveTitle>
        <Tooltip title={`${activityName} ${_t('49bXy3b1V7KMVkakUNizJZ')}`}>
          <div className="title">{`${activityName} ${_t('49bXy3b1V7KMVkakUNizJZ')}`}</div>
        </Tooltip>
      </ActiveTitle>

      <div className="symbolInfoWrapper">
        <SymbolInfo logoUrl={logoUrl} name={name} subName={subName} className="symbolInfo" />
        <SymbolInfoHot>
          <img src={hotSvg} alt="hot" />
          {hot ? <NumberFormat lang={currentLang}>{hot}</NumberFormat> : '0'}
        </SymbolInfoHot>
      </div>

      <SymbolInfoButton>
        <div className="date">
          {`${_t('psc7EyANJ1tUGmT32dzsbn')}: `}
          {date ? (
            <DateTimeFormat
              date={date}
              lang={currentLang}
              options={{ hour: undefined, minute: undefined, second: undefined }}
            >
              {date}
            </DateTimeFormat>
          ) : (
            '-'
          )}
        </div>
        {symbol ? (
          <Button fullWidth={size === 'sm'} onClick={handle2Trade}>
            {_t('7h85x8NVurLKy5n7qMpnc1')}
          </Button>
        ) : null}
      </SymbolInfoButton>
    </StyledCard>
  );
}

export default memo(HistoryProjectCard);
