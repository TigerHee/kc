/**
 * Owner: june.lee@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useResponsive } from '@kux/mui';
import { useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import NumberFormat from 'src/components/common/NumberFormat';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import Tooltip from '../components/Tooltip';
import { useActivityStatus } from '../hooks';
import { PriceItem, StyledOrderSummary, TopBar } from '../styledComponents';

const OrderSummaryBar = () => {
  const isInApp = JsBridge.isApp();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const { sm } = useResponsive();
  const activityStatus = useActivityStatus();
  const offerCurrency = useSelector((state) => state.aptp.deliveryCurrencyInfo?.offerCurrency);
  const shortName = useSelector((state) => state.aptp.deliveryCurrencyInfo?.shortName);
  const userDealTotal = useSelector((state) => state.aptp.userDealTotal, shallowEqual);
  const {
    buyMatchVol = 0,
    buySettleVol = 0,
    dealTotalVol = 0,
    sellMatchVol = 0,
    sellSettleVol = 0,
  } = userDealTotal;
  const dispatch = useDispatch();

  useEffect(() => {
    if (activityStatus === 0) {
      return;
    }
    if (shortName) {
      dispatch({
        type: 'aptp/pullUserDealTotal',
        payload: {
          currency: shortName,
        },
      });
    }
  }, [activityStatus, dispatch, shortName]);

  const showDefault = !user || activityStatus === 0;

  return (
    <StyledOrderSummary>
      <TopBar>
        <div className="container" style={sm ? { gap: '24px' } : {}}>
          <PriceItem style={{ flexWrap: 'wrap' }}>
            <Tooltip title={_t('0c23c40d87db4000a341')}>
              <div className="title">
                {activityStatus > 1
                  ? _t('64460d7991224000a373', { offerCurrency: shortName })
                  : _t('9d4ba21fe1484000acb6', { shortName })}
              </div>
            </Tooltip>
            <div className="value">
              {activityStatus > 1 && (
                <>{showDefault ? '--' : <NumberFormat>{buySettleVol}</NumberFormat>}/</>
              )}
              {showDefault ? '--' : <NumberFormat>{buyMatchVol}</NumberFormat>}
            </div>
          </PriceItem>
          <PriceItem style={{ flexWrap: 'wrap' }}>
            <Tooltip title={_t('8f81f2020f524000accd')}>
              <div className="title">
                {activityStatus > 1
                  ? _t('d317c86960c04000a5eb', { offerCurrency: shortName })
                  : _t('e4c94ce8432f4000a150', { shortName })}
              </div>
            </Tooltip>
            <div className="value">
              {activityStatus > 1 && (
                <>{showDefault ? '--' : <NumberFormat>{sellSettleVol}</NumberFormat>}/</>
              )}
              {showDefault ? '--' : <NumberFormat>{sellMatchVol}</NumberFormat>}
            </div>
          </PriceItem>
          <PriceItem style={{ flexWrap: 'wrap' }}>
            <Tooltip title={_t('46bc7c1449914000af78')}>
              <div className="title">{_t('415a75adacf24000aed7', { offerCurrency })}</div>
            </Tooltip>
            <div className="value">
              {showDefault ? '--' : <NumberFormat>{dealTotalVol}</NumberFormat>}
            </div>
          </PriceItem>
        </div>
      </TopBar>
    </StyledOrderSummary>
  );
};
export default OrderSummaryBar;
