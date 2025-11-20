/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, NumberFormat } from '@kux/mui';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import hotSvg from 'static/votehub/hot.svg';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../../../hooks';
import { SymbolInfo } from '../ProjectCard';
import { StyledWinProjectCard, SymbolInfoHot } from './styledComponents';

/**
 * 项目卡票
 * @param {logoUrl} 项目图片 required
 * @param {name} 项目名称 required
 * @param {subName} 项目简称 required
 * @param {description} 项目介绍 required
 * @param {hot} 项目热度（票数）
 * @returns
 */
function WinProjectCard({ logoUrl, name, subName, description, hot, item }) {
  const { currentLang } = useLocale();
  const size = useResponsiveSize();
  const dispatch = useDispatch();

  const handleDetail = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        detailModal: true,
        detailInfo: item,
      },
    });
  }, [dispatch, item]);

  return (
    <StyledWinProjectCard>
      <SymbolInfo logoUrl={logoUrl} name={name} subName={subName} />
      <div className="desc">{description}</div>
      <div className="bttomBar">
        <SymbolInfoHot>
          <img src={hotSvg} alt="hot" />
          {hot ? <NumberFormat lang={currentLang}>{hot}</NumberFormat> : '0'}
        </SymbolInfoHot>
        <Button type="default" fullWidth={size === 'sm'} onClick={handleDetail}>
          {_t('pKkEvKAzGPcTbthrw7ypWu')}
        </Button>
      </div>
    </StyledWinProjectCard>
  );
}

export default memo(WinProjectCard);
