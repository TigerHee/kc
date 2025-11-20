/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRightOutlined, ICCampaignOutlined } from '@kux/icons';
import { Alert, Divider, useResponsive } from '@kux/mui';
import { useCountDown } from 'ahooks';
import classNames from 'classnames';
import { useStatus } from 'components/RocketZone/hooks';
import { Link } from 'components/Router';
import map from 'lodash/map';
import { memo, useCallback, useMemo, useRef } from 'react';
import LazyImg from 'src/components/common/LazyImg';
import { _t } from 'tools/i18n';
import { locateToUrl, locateToUrlInApp, transformTimeStr } from 'TradeActivity/utils';
import StatusComp from '../StatusComp';
import { StyledCarousel } from '../styledComponents';
import NumFormatComp from './NumFormatComp';
import PoolCard from './PoolCard';
import {
  AlertWrapper,
  AnnouncementWrapper,
  ColoumnWrapper,
  CountdownWrapper,
  CurrencyInfoWrapper,
  EmptyActivityWrapper,
  MoreWrapper,
  PoolListWrapper,
  ProjectDataWrapper,
  ProjectInfoWrapper,
  StyledProjectItem,
  ThreeColoumnWrapper,
  TwoColoumnWrapper,
} from './styledComponents';

const emptyArr = [];

const CoutdwonWithBtn = memo(({ date }) => {
  const [__, formattedRes] = useCountDown({
    targetDate: date,
    interval: 1000,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <CountdownWrapper>
      {_t('8583a5a3d34b4000acd8')}
      <span className="timeCounter">
        {!!days && (
          <>
            <span className="item">{transformTimeStr(days)}</span>
            <span className="split">:</span>
          </>
        )}
        <span className="item">{transformTimeStr(hours)}</span>
        <span className="split">:</span>
        <span className="item">{transformTimeStr(minutes)}</span>
        <span className="split">:</span>
        <span className="item">{transformTimeStr(seconds)}</span>
      </span>
    </CountdownWrapper>
  );
});

const AnnouncementContent = memo(({ announcementAddress }) => {
  const handleLocateTo = useCallback(
    (e) => {
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();

      locateToUrl(announcementAddress);
    },
    [announcementAddress],
  );

  if (!announcementAddress) {
    return null;
  }

  return (
    <AnnouncementWrapper onClick={handleLocateTo}>
      <ICCampaignOutlined />
      {`${_t('c8b9b2cd8f4b4000a4f4')}>>`}
    </AnnouncementWrapper>
  );
});

export default function ProjectItem({
  logoUrl,
  shortName,
  announcementAddress,
  mediaInfo,
  endActivity,
  startActivity,
  poolInfoList,
  totalReturns,
  url,
}) {
  const { sm, lg } = useResponsive();
  const isInApp = JsBridge.isApp();
  const sliderRef = useRef();

  const medias = useMemo(() => {
    try {
      if (mediaInfo) {
        return JSON.parse(mediaInfo);
      }
      return emptyArr;
    } catch (error) {
      return emptyArr;
    }
  }, [mediaInfo]);

  const status = useStatus({ startDate: startActivity, endDate: endActivity });

  const pools = useMemo(() => {
    if (poolInfoList?.length) {
      return poolInfoList.slice(0, 3);
    }
    return emptyArr;
  }, [poolInfoList]);

  const handleLocateTo = useCallback(() => {
    locateToUrlInApp(url);
  }, [url]);

  const CardList = useMemo(() => {
    const content = () =>
      map(pools, (item) => {
        if (item) {
          return (
            <PoolCard
              {...item}
              qoute={shortName}
              qouteIconUrl={logoUrl}
              status={status}
              key={`${shortName}_${item.stakingToken}`}
              earnTokenName={shortName}
              url={url}
            />
          );
        }
      });
    if (!sm) {
      const settings = {
        ref: sliderRef,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        //rtl: true,
      };

      return (
        <ColoumnWrapper>
          <StyledCarousel {...settings}>
            {content()}
            {poolInfoList?.length > 3 && (
              <EmptyActivityWrapper>
                <Link to={url} onClick={handleLocateTo} dontGoWithHref={isInApp}>
                  {_t('cef9c33db3da4000ae92')}
                  <ICArrowRightOutlined />
                </Link>
              </EmptyActivityWrapper>
            )}
          </StyledCarousel>
        </ColoumnWrapper>
      );
    } else if (pools?.length < 3 || !lg) {
      return (
        <TwoColoumnWrapper>
          {content()}
          {poolInfoList?.length > 3 && (
            <EmptyActivityWrapper>
              <Link to={url} onClick={handleLocateTo} dontGoWithHref={isInApp}>
                {_t('cef9c33db3da4000ae92')}
                <ICArrowRightOutlined />
              </Link>
            </EmptyActivityWrapper>
          )}
        </TwoColoumnWrapper>
      );
    } else {
      return (
        <>
          <ThreeColoumnWrapper>{content()}</ThreeColoumnWrapper>
          {poolInfoList?.length > 3 && (
            <MoreWrapper>
              <Link to={url} onClick={handleLocateTo} dontGoWithHref={isInApp}>
                {_t('cef9c33db3da4000ae92')}
                <ICArrowRightOutlined />
              </Link>
            </MoreWrapper>
          )}
        </>
      );
    }
  }, [sm, lg, pools, poolInfoList, shortName, logoUrl, status, url, isInApp, handleLocateTo]);

  return (
    <StyledProjectItem
      className={classNames('projectCard', {
        ['complementary']: status === 0,
        ['primary']: status === 1,
        ['grey']: status === 2,
      })}
    >
      {sm && <div className="bg" />}
      <StatusComp status={status} typeName="gemNewPool" />

      <div className="content">
        <ProjectInfoWrapper>
          <CurrencyInfoWrapper>
            <div className="logo">
              <LazyImg src={logoUrl} alt="logo" />
            </div>

            <div className="currencyIntro">
              <div className="nameWrapper">
                <span className="name">
                  <span>{shortName}</span>
                  <AnnouncementContent announcementAddress={announcementAddress} />
                </span>
                {/* 未开始显示倒计时 */}
                {status === 0 && startActivity && (
                  <>
                    <Divider type="vertical" />
                    <CoutdwonWithBtn date={startActivity} />
                  </>
                )}
              </div>
              {medias?.length ? (
                <div className="media">
                  {medias?.map((media, index) => {
                    return (
                      <a
                        className="mediaItem"
                        key={`${media?.mediaName}`}
                        href={media?.value}
                        // onClick={(e) => handleJump(e, media?.value)}
                      >
                        {media?.mediaName}
                      </a>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </CurrencyInfoWrapper>
          <ProjectDataWrapper>
            <div className="label">{_t('59db786bbb9b4000a2ce', { currency: shortName })}</div>
            <div className="value">
              <NumFormatComp value={totalReturns} />
            </div>
          </ProjectDataWrapper>
        </ProjectInfoWrapper>
        {status === 0 && (
          <AlertWrapper>
            <Alert showIcon type="warning" title={_t('36c9d9efed014000a8d7')} />
          </AlertWrapper>
        )}

        <PoolListWrapper>{CardList}</PoolListWrapper>
      </div>
    </StyledProjectItem>
  );
}
