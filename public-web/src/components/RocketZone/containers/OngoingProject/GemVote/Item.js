/*
 * owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICSuccessOutlined } from '@kux/icons';
import { NumberFormat } from '@kux/mui';
import React, { memo, useMemo } from 'react';
import { _t } from 'src/tools/i18n';
import defaultSvg from 'static/rocket_zone/default.svg';
import hotSvg from 'static/votehub/hot.svg';
import rank1Svg from 'static/votehub/rank1.svg';
import rank2Svg from 'static/votehub/rank2.svg';
import rank3Svg from 'static/votehub/rank3.svg';
import { IS_SSG_ENV } from 'utils/ssgTools';
import ButtonComp from '../ButtonComp';
import {
  BannerContent,
  BannerFooter,
  Buttons,
  CardBanner,
  CardBg,
  HighlightValue,
  Label,
  Logo,
  Mask,
  Name,
  PlaceholderText,
  Progress,
  Row,
  TaskCard,
} from './style';

const rankImg = [rank1Svg, rank2Svg, rank3Svg];

const BannerFooterComp = memo(({ voteResult, status }) => {
  const { isRTL } = useLocale();

  // 结束后才显示，显示状态只有成功失败
  if (status !== 2) {
    return null;
  }

  return (
    <BannerFooter>
      <Progress isRTL={isRTL} voteResult={voteResult}>
        <div className="label">{_t('status')}</div>
        <div className="value">
          {voteResult === 1 ? (
            <>
              <ICSuccessOutlined /> {_t('b254c8443ee44000acbc')}
            </>
          ) : (
            _t('bbac0ef185b04000af8e')
          )}
        </div>
      </Progress>
    </BannerFooter>
  );
});

const GemVoteItem = ({ voteResult, logoUrl, currency, url, voteNumber, status, rank }) => {
  const { currentLang } = useLocale();

  const _logoUrl = useMemo(() => {
    return logoUrl || defaultSvg;
  }, [logoUrl]);

  return (
    <TaskCard>
      <CardBanner>
        <Mask>
          <CardBg src={_logoUrl} alt="coin icon" />
          {rank && !IS_SSG_ENV ? (
            <img src={rankImg[rank - 1]} alt="rank" className="rankLogo" />
          ) : null}
          <BannerContent className="slot-taskItem-name" status={status}>
            <div className="flex-center">
              <Logo src={_logoUrl} alt="coin icon" />
              <Name>{currency}</Name>
            </div>
          </BannerContent>

          <BannerFooterComp voteResult={voteResult} status={status} />
        </Mask>
      </CardBanner>
      <Row className="mt-16">
        <Label>{_t('cd328af292d84000adc8')}</Label>
        <HighlightValue>
          <img src={hotSvg} alt="hot" />
          {voteNumber && !IS_SSG_ENV ? (
            <NumberFormat lang={currentLang}>{voteNumber}</NumberFormat>
          ) : (
            <PlaceholderText>--</PlaceholderText>
          )}
        </HighlightValue>
      </Row>

      <Buttons>
        <ButtonComp status={status} typeName="gemVote" shortName={currency} url={url} />
      </Buttons>
    </TaskCard>
  );
};

export default React.memo(GemVoteItem);
