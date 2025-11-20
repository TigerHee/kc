/**
 * Owner: jessie@kupotech.com
 */
import { Button, useResponsive } from '@kux/mui';
import AnimateButton from 'components/RocketZone/components/AnimateButton';
import { memo, useCallback } from 'react';
import { _t } from 'tools/i18n';
import { locateToUrl } from 'TradeActivity/utils';
import { trackClick } from 'utils/ga';

const ButtonComp = memo(({ status, typeName, url, shortName }) => {
  const { sm } = useResponsive();

  // spotlight burningdrop 需要admin配置跳转链接
  const handleJump = useCallback(() => {
    if (url) {
      locateToUrl(url);
    }

    trackClick([typeName, 'Join'], { symbol: shortName });
  }, [url, shortName, typeName]);

  // 未开始\交割中（已结束）
  if (status !== 1) {
    return (
      <Button onClick={handleJump} className="subscribe-btn" fullWidth={!sm} variant="outlined">
        {_t('pKkEvKAzGPcTbthrw7ypWu')}
      </Button>
    );
  }

  // 进行中显示立即参与
  return (
    <AnimateButton onClick={handleJump} className="subscribe-btn" fullWidth={!sm}>
      {typeName === 'gemPreMarket' ? _t('rg5JBATufUfWUkx3gkSvxw') : _t('371e1a74535c4000ad95')}
    </AnimateButton>
  );
});

export default ButtonComp;
