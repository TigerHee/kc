/*
 * owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';
import { useStatus } from 'components/RocketZone/hooks';
import moment from 'moment';
import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import TimeCountDown from 'routes/SlothubPage/components/TimeCountDown';
import DateTimeUTCFormat from 'src/routes/SlothubPage/components/mui/DateTimeUTCFormat';
import { _t } from 'src/tools/i18n';
import siteConfig from 'utils/siteConfig';
import ButtonComp from '../ButtonComp';
import {
  BannerContent,
  BannerFooter,
  Buttons,
  CardBanner,
  CardBg,
  DateBox,
  HighlightValue,
  Label,
  Logo,
  Mask,
  Name,
  Progress,
  ProgressLabel,
  Row,
  TaskCard,
} from './style';

const { KUCOIN_HOST } = siteConfig;

const BannerFooterComp = memo(({ endActivity }) => {
  const dispatch = useDispatch();
  const { isRTL, currentLang } = useLocale();

  // 已结束
  const isEnded = useMemo(() => {
    return moment().isAfter(endActivity);
  }, [endActivity]);

  const handleDataList = useCallback(() => {
    dispatch({
      type: 'rocketZone/pullGemspaceOngoingGem',
    });
  }, [dispatch]);

  return (
    <BannerFooter>
      <Progress isRTL={isRTL}>
        {isEnded ? (
          <ProgressLabel>{_t('07e43af0e0574000a983')}</ProgressLabel>
        ) : (
          <>
            <ProgressLabel>{_t('9daa36bfc6ce4000ace0')}</ProgressLabel>
            <TimeCountDown
              className="ml-6"
              value={endActivity}
              onEnd={handleDataList}
              intervalThemeConfig={{
                gapWidth: 2,
                colorTheme: 'light',
              }}
            />
          </>
        )}
      </Progress>
      {isEnded && (
        <DateBox>
          <DateTimeUTCFormat date={endActivity} lang={currentLang} options={{ second: undefined }}>
            {endActivity}
          </DateTimeUTCFormat>
        </DateBox>
      )}
    </BannerFooter>
  );
});

const Item = ({ endActivity, startActivity, logoUrl, shortName, code, totalPool }) => {
  const { currentLang } = useLocale();
  const status = useStatus({ startDate: startActivity, endDate: endActivity });

  const url = useMemo(() => {
    return `/gemslot/detail/code/${code}`;
  }, [code]);

  return (
    <TaskCard>
      <CardBanner>
        <Mask>
          <CardBg src={logoUrl} alt="coin icon" />

          <BannerContent className="slot-taskItem-name">
            <div className="flex-center">
              <Logo src={logoUrl} alt="coin icon" />
              <Name>{shortName}</Name>
            </div>
          </BannerContent>

          <BannerFooterComp endActivity={endActivity} />
        </Mask>
      </CardBanner>
      <Row className="mt-16">
        <Label>{_t('bbc97b1b3cc84000a8a6')}</Label>
        <HighlightValue>
          {totalPool ? <NumberFormat lang={currentLang}>{totalPool}</NumberFormat> : '--'}

          <span className="ml-4">{shortName}</span>
        </HighlightValue>
      </Row>

      <Buttons>
        <ButtonComp status={status} typeName="gemSlot" shortName={shortName} url={url} />
      </Buttons>
    </TaskCard>
  );
};

export default React.memo(Item);
