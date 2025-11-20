/**
 * Owner: jessie@kupotech.com
 */
import { formatNumber, transStepToPrecision } from 'helper';
import { useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Tooltip from '../components/Tooltip';
import { useActivityStatus } from '../hooks';
import { PriceItem, StyledPriceBar, TopBar } from '../styledComponents';

const PriceBar = () => {
  const activityStatus = useActivityStatus();
  const offerCurrency = useSelector((state) => state.aptp.deliveryCurrencyInfo?.offerCurrency);
  const shortName = useSelector((state) => state.aptp.deliveryCurrencyInfo?.shortName);
  const priceIncrement = useSelector((state) => state.aptp.deliveryCurrencyInfo?.priceIncrement);
  const priceInfo = useSelector((state) => state.aptp.priceInfo, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (offerCurrency && shortName) {
      if (activityStatus < 2) {
        dispatch({
          type: 'aptp/pullPriceInfo@polling',
          payload: {
            symbol: `${shortName}-${offerCurrency}`,
          },
        });
        return () => {
          dispatch({
            type: 'aptp/pullPriceInfo@polling:cancel',
          });
        };
      } else {
        dispatch({
          type: 'aptp/pullPriceInfo',
          payload: {
            symbol: `${shortName}-${offerCurrency}`,
          },
        });
      }
    }
  }, [activityStatus, offerCurrency, shortName, dispatch]);

  if (activityStatus === 0) {
    return false;
  }

  return (
    <StyledPriceBar activityStatus={activityStatus}>
      <TopBar>
        <div className="container">
          <PriceItem>
            {activityStatus < 3 ? (
              <Tooltip title={_t('najm2ZBhumtQsRDRTJPLsR')}>
                <div className="title">{_t('mY7CdPaQz25Gej7Z2wq93A')}</div>
              </Tooltip>
            ) : (
              <Tooltip title={_t('4fbRb5h36VtFb3ywbRWkF2')}>
                <div className="title">{_t('23LB2Vd8LXj7LiKmfzMwRm')}</div>
              </Tooltip>
            )}
            <div className="value">{`${
              priceInfo?.latestPrice
                ? formatNumber(priceInfo?.latestPrice, transStepToPrecision(priceIncrement))
                : '--'
            } ${offerCurrency || ''}`}</div>
          </PriceItem>
          {activityStatus < 3 && (
            <PriceItem>
              <Tooltip title={_t('cXxhdsnMSi2R8vF1DyPqML')}>
                <div className="title">{_t('okUkNdRtS4V4s2aE84dEx3')}</div>
              </Tooltip>
              <div className="value">{`${
                priceInfo?.minSellPrice
                  ? formatNumber(priceInfo?.minSellPrice, transStepToPrecision(priceIncrement))
                  : '--'
              } ${offerCurrency || ''}`}</div>
            </PriceItem>
          )}

          {activityStatus < 3 && (
            <PriceItem>
              <Tooltip title={_t('my8YQYKCYHzaPmMHvYQyqK')}>
                <div className="title">{_t('me9dGL4Vk5vUE7WLM9kYm6')}</div>
              </Tooltip>
              <div className="value">{`${
                priceInfo?.maxBuyPrice
                  ? formatNumber(priceInfo?.maxBuyPrice, transStepToPrecision(priceIncrement))
                  : '--'
              } ${offerCurrency || ''}`}</div>
            </PriceItem>
          )}

          <PriceItem>
            <Tooltip title={_t('g6nc9rdZHefyTGaYjm3zbE')}>
              <div className="title">{_t('wRWkH78Api3bn24R4B3MtD')}</div>
            </Tooltip>
            <div className="value">{`${
              priceInfo?.avgPrice
                ? formatNumber(priceInfo?.avgPrice, transStepToPrecision(priceIncrement))
                : '--'
            } ${offerCurrency || ''}`}</div>
          </PriceItem>
        </div>
      </TopBar>
    </StyledPriceBar>
  );
};
export default PriceBar;
