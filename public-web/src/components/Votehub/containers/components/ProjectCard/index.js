/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, NumberFormat } from '@kux/mui';
import { isNil } from 'lodash';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import { useSelector } from 'src/hooks/useSelector';
import hotSvg from 'static/votehub/hot.svg';
import rank1Svg from 'static/votehub/rank1.svg';
import rank2Svg from 'static/votehub/rank2.svg';
import rank3Svg from 'static/votehub/rank3.svg';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { IS_SSG_ENV } from 'utils/ssgTools';
import { Tooltip } from '../../../components';
import { skip2Login } from '../../../util';
import {
  HotWrapper,
  NameWrapper,
  StyledCard,
  SymbolInfoButton,
  SymbolInfoHot,
  SymbolInfoWrapper,
} from './styledComponents';

const emptyObj = {};

const rankImg = [rank1Svg, rank2Svg, rank3Svg];

export function SymbolInfo({ logoUrl, name, subName, className }) {
  return (
    <SymbolInfoWrapper className={className}>
      <LazyImg src={logoUrl} alt="logo" className="logo" />
      <NameWrapper>
        <span className="name">{name}</span>
        <span className="subName">{subName}</span>
      </NameWrapper>
    </SymbolInfoWrapper>
  );
}

/**
 * 项目卡票
 * @param {logoUrl} 项目图片 required
 * @param {name} 项目名称 required
 * @param {subName} 项目简称 required
 * @param {description} 项目介绍 required
 * @param {hot} 项目热度（票数）
 * @param {rank} 前三名显示特殊样式 0正常显示 默认0
 * @param {isProcessing} 是否显示热度和投票 默认不显示
//  * @param {isSpecial} 是否特殊样式（pad下） 默认正常
 * @returns
 */
function ProjectCard({
  logoUrl,
  name,
  subName,
  description,
  hot,
  rank = 0,
  // isSpecial = false,
  item = emptyObj,
}) {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const activityStatus = useSelector((state) => state.votehub.activityStatus);

  // 参与状态 0：正常参与，1：提前上币，2：停止投票
  const status = item?.status;

  const handleDetail = useCallback(() => {
    dispatch({
      type: 'votehub/update',
      payload: {
        detailModal: true,
        detailInfo: item,
      },
    });
  }, [dispatch, item]);

  const handleTicket = useCallback(() => {
    trackClick(['main', 'vote'], {
      currency: item?.currency,
    });
    if (!user) {
      skip2Login();
      return;
    }

    dispatch({
      type: 'votehub/update',
      payload: {
        ticketModal: true,
        detailInfo: item,
      },
    });
  }, [dispatch, item, user]);

  const ActivityCardButtonComp = useMemo(() => {
    if (activityStatus === 2) {
      return (
        <>
          <Button type="default" fullWidth onClick={handleDetail}>
            {_t('pKkEvKAzGPcTbthrw7ypWu')}
          </Button>
          {!isNil(status) && status !== 1 ? (
            <Button fullWidth disabled={status == 2} onClick={handleTicket}>
              {_t('viGmukytrH6uRXvMxYYK1Q')}
            </Button>
          ) : null}
        </>
      );
    } else {
      return (
        <Button type="default" fullWidth onClick={handleDetail}>
          {_t('pKkEvKAzGPcTbthrw7ypWu')}
        </Button>
      );
    }
  }, [status, activityStatus, handleDetail, handleTicket]);

  return (
    <StyledCard className={`${rank && !IS_SSG_ENV ? `num${rank}` : 'num'}`}>
      {rank && !IS_SSG_ENV ? (
        <LazyImg src={rankImg[rank - 1]} alt="rank" className="rankLogo" />
      ) : null}
      <SymbolInfo logoUrl={logoUrl} name={name} subName={subName} />

      <div className="desc">{description}</div>
      <HotWrapper>
        <SymbolInfoHot>
          <Tooltip title={_t('aEr2BmBPRjpzjdLoTEbz8E')}>
            <LazyImg src={hotSvg} alt="hot" />
          </Tooltip>

          {hot && !IS_SSG_ENV ? <NumberFormat lang={currentLang}>{hot}</NumberFormat> : '--'}
        </SymbolInfoHot>
        {status === 1 || status === 2 ? (
          <span className={`${status === 1 ? 'active' : ''} tip`}>
            {status === 1 ? _t('91k75acML8HPbe4ERcW1Hr') : _t('1QkmtFziaJVmztrXP5oeN6')}
          </span>
        ) : null}
      </HotWrapper>

      <SymbolInfoButton>{ActivityCardButtonComp}</SymbolInfoButton>
    </StyledCard>
  );
}

export default memo(ProjectCard);
