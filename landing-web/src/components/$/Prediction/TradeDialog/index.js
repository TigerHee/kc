/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Dialog } from '@kufox/mui';
import { sensors } from 'utils/sensors';
import { debounce } from 'lodash';
import { openPage } from 'helper';
import { _t, _tHTML } from 'src/utils/lang';
import { useIsMobile } from 'components/Responsive';
import { Tip, ChooseBox, ChooseItem, ChooseIcon, ChooseContent, ChooseGo, BodyWrapper } from './StyledComps';

import FUTURE_TRADE from 'assets/prediction/future-trade.svg';
import SPOT_TRADE from 'assets/prediction/spot-trade.svg';
import ARROW_GO from 'assets/prediction/arrow-go.svg';

import { TRADE_URL } from '../config';

const TradeDialog = () => {
  const { activityConfig, userGuessInfo, currentRound } = useSelector(state => state.prediction);
  const { spotAmount, futureAmount } = activityConfig;
  const { id: activityId } = currentRound;
  const { currentIneffectiveNum } = userGuessInfo[activityId] || {};
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const { isInApp } = useSelector(state => state.app);
  const { showTradeDialog } = useSelector(state => state.prediction);
  // 关闭弹窗
  const onClose = useCallback(
    () => {
      dispatch({
        type: 'prediction/update',
        payload: {
          showTradeDialog: false,
        },
      });
    },
    [dispatch],
  );
  // 跳转页面
  const goToPage = useCallback(
    debounce(
      type => {
        const urlObj = TRADE_URL[type];
        let url;
        if (isInApp) {
          url = urlObj?.appUrl;
        } else if (isMobile) {
          url = urlObj?.h5Url;
        } else {
          url = urlObj?.pcUrl;
        }
        // 埋点
        sensors.trackClick([type === 'SPOT' ? 'Spot' : 'Futures', '1']);
        // 跳转
        if (url) {
          onClose();
          openPage(isInApp, url);
        }
      },
      500,
      { leading: true, trailing: false },
    ),
    [onClose, openPage, isInApp, isMobile],
  );

  return (
    <Dialog
      size="mini"
      open={showTradeDialog}
      title={_t('prediction.goUnlock')}
      onCancel={onClose}
      footer={null}
    >
      <BodyWrapper>
        <Tip>{_tHTML('prediction.unlocknumberTip', { a: currentIneffectiveNum })}</Tip>
        <ChooseBox>
          <ChooseItem onClick={() => goToPage('SPOT')}>
            <ChooseIcon>
              <img src={SPOT_TRADE} alt="ChooseIcon1" />
            </ChooseIcon>
            <ChooseContent>
              <div className="result-text">
                <span>{_t('prediction.spotTrade')}</span>
                <ChooseGo src={ARROW_GO} />
              </div>
              <div className="trading-volume">
                {_tHTML('prediction.spotTradeAmount', { a: spotAmount })}
              </div>
            </ChooseContent>
          </ChooseItem>
          <ChooseItem onClick={() => goToPage('FUTURE')}>
            <ChooseIcon>
              <img src={FUTURE_TRADE} alt="ChooseIcon2" />
            </ChooseIcon>
            <ChooseContent>
              <div className="result-text">
                <span>{_t('prediction.future')}</span>
                <ChooseGo src={ARROW_GO} />
              </div>
              <div className="trading-volume">
                {_tHTML('prediction.futureTradeAmount', { a: futureAmount })}
              </div>
            </ChooseContent>
          </ChooseItem>
        </ChooseBox>
      </BodyWrapper>
    </Dialog>
  );
};

TradeDialog.propTypes = {};

TradeDialog.defaultProps = {};

export default TradeDialog;
