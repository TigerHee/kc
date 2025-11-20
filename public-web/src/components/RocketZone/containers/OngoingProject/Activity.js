/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import moment from 'moment';
import { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import LazyImg from 'src/components/common/LazyImg';
import defaultSvg from 'static/rocket_zone/default.svg';
import { useStatus } from '../../hooks';
import { useFixSpotlightColumnData } from './hooks/useFixSpotlightColumnData';
import ButtonComp from './ButtonComp';
import CountDownComp from './CountDownComp';
import CurrencyInfoComp from './CurrencyInfoComp';
import StatusComp from './StatusComp';
import {
  DataInfoWrapper,
  HeaderWrapper,
  StyledActivity,
  StyledButtonGroup,
  StyledRightWrapper,
} from './styledComponents';

const DataInfoComp = memo(({ columns }) => {
  return (
    <DataInfoWrapper>
      {columns?.map(({ label, comp }) => {
        return (
          <div className="item">
            <div className="label">{label}</div>
            <div className="value">{comp}</div>
          </div>
        );
      })}
    </DataInfoWrapper>
  );
});

const Activity = memo(
  ({
    fire,
    worldPremiere,
    startActivity, // 活动开始时间，gemvote特殊返回投票开始时间
    endActivity, // 活动结束时间，gemvote特殊返回投票结束时间
    startTrade,
    endTrade,
    shortName,
    fullName,
    logoUrl,
    url,
    typeName,
    columsDatas,
    deliveryTime: _deliveryTime,
    preDeliveryTime: _preDeliveryTime,
    lastTradePrice,
    avgPrice,
    userUpperLimit,
    productUpperLimit,
    lockPeriod,
    currency,
    price,
    quoteCurrency,
    campaignAmount,
    activityRegistrationCount,
    displayTradeEndAt,
  }) => {
    const dispatch = useDispatch();
    const { sm, lg } = useResponsive();

    const startDate = useMemo(() => {
      // premarket特殊处理 premarket返回时间为秒级，需要*1000
      if (typeName === 'gemPreMarket') {
        return startActivity * 1000 || 0;
      }
      return startTrade || startActivity || 0;
    }, [startActivity, startTrade, typeName]);

    const endDate = useMemo(() => {
      if (typeName === 'gemPreMarket') {
        return endActivity * 1000 || 0;
      }
      return endTrade || endActivity || 0;
    }, [endActivity, endTrade, typeName]);

    const deliveryTime = useMemo(() => {
      if (typeName === 'gemPreMarket') {
        return _deliveryTime * 1000 || 0;
      }
    }, [_deliveryTime, typeName]);

    const preDeliveryTime = useMemo(() => {
      if (typeName === 'gemPreMarket') {
        return _preDeliveryTime * 1000 || 0;
      }
    }, [_preDeliveryTime, typeName]);

    const status = useStatus({ startDate, endDate, deliveryTime, preDeliveryTime, typeName });

    const fixData = useFixSpotlightColumnData(typeName, url);
    const columns = useMemo(() => {
      return columsDatas
        ? columsDatas({
            deliveryTime,
            lastTradePrice,
            avgPrice,
            lockPeriod,
            productUpperLimit,
            userUpperLimit,
            currency,
            price,
            quoteCurrency,
            campaignAmount,
            activityRegistrationCount,
            fixData: fixData,
            shortName,
          })
        : [];
    }, [
      columsDatas,
      deliveryTime,
      lastTradePrice,
      avgPrice,
      lockPeriod,
      productUpperLimit,
      userUpperLimit,
      currency,
      price,
      quoteCurrency,
      campaignAmount,
      activityRegistrationCount,
      shortName,
      fixData,
    ]);

    const countDowncomp = useMemo(() => {
      let _endDate = endDate;
      // 盘前交易第三状态是交割中，所以倒计时是距离交割时间，没有交割时间则不展示
      if (typeName === 'gemPreMarket') {
        // 交易中并且展示结束时间时
        if (status === 1 && displayTradeEndAt) {
          _endDate = endDate;
        } else if (status === 3) {
          // 交割中
          _endDate = deliveryTime;
        } else {
          // 待交割 已结束 不显示倒计时
          _endDate = 0;
        }
      }
      return (
        <CountDownComp
          startDate={startDate}
          endDate={_endDate}
          status={status}
          withInButton={!sm}
          typeName={typeName}
        />
      );
    }, [startDate, endDate, deliveryTime, displayTradeEndAt, typeName, status, sm]);

    return (
      <StyledActivity>
        <StatusComp status={status} typeName={typeName} />
        <div className="content">
          <HeaderWrapper>
            <div className="logo">
              <LazyImg
                src={
                  moment().isBefore(startDate) && typeName === 'gemVote'
                    ? defaultSvg
                    : logoUrl || defaultSvg
                }
              />
            </div>

            {lg ? null : (
              <>
                <CurrencyInfoComp
                  shortName={shortName}
                  fullName={fullName}
                  fire={fire}
                  worldPremiere={worldPremiere}
                />
                {sm && <div className="headerCountdown">{countDowncomp}</div>}
              </>
            )}
          </HeaderWrapper>
          <StyledRightWrapper>
            {lg && (
              <CurrencyInfoComp
                shortName={shortName}
                fullName={fullName}
                fire={fire}
                worldPremiere={worldPremiere}
              />
            )}
            <div className="bottom-wrapper">
              <DataInfoComp columns={columns} />

              {lg && countDowncomp}

              <StyledButtonGroup>
                {!sm && countDowncomp}
                <ButtonComp status={status} typeName={typeName} shortName={shortName} url={url} />
              </StyledButtonGroup>
            </div>
          </StyledRightWrapper>
        </div>
      </StyledActivity>
    );
  },
);

export default Activity;
