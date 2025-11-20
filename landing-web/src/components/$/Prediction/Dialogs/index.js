/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import { Dialog, Button } from '@kufox/mui';
import { useHistory } from 'react-router';
import { debounce } from 'lodash';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';
import { separateNumber } from 'helper';
import JsBridge from 'utils/jsBridge';
import { LANDING_HOST } from 'utils/siteConfig';
import { _t } from 'src/utils/lang';
import { THEME_COLOR } from '../config';
import { getUtcZeroTime } from '../selector';

const BodyWrapper = styled.div`
  width: 100%;
  margin-top: ${px2rem(-20)};
  .activity-end-text {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(24)};
    color: #00142a;
  }
  .highlight {
    color: ${THEME_COLOR.primary};
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: ${px2rem(16)};
`;

const WrapButton = styled(Button)`
  background: ${THEME_COLOR.primary};
  color: #fff;
  width: 100%;
  :active,
  :hover,
  :visited {
    background: ${THEME_COLOR.primary};
    color: #fff;
  }
`;

const CancelButton = styled(Button)`
  width: 100%;
  height: ${px2rem(26)};
  margin-top: ${px2rem(12)};
  text-align: center;
  background: transparent;
  color: ${THEME_COLOR.primary};
  :active,
  :hover,
  :visited {
    background: transparent;
    color: ${THEME_COLOR.primary};
  }
`;

export const ActivityEndDialog = () => {
  const dispatch = useDispatch();
  const { showActivityEndDialog } = useSelector(state => state.prediction);
  // 关闭弹窗
  const onClose = useCallback(
    () => {
      dispatch({
        type: 'prediction/update',
        payload: {
          showActivityEndDialog: false,
        },
      });
    },
    [dispatch],
  );
  return (
    <Dialog
      size="mini"
      open={showActivityEndDialog}
      title={null}
      onOk={onClose}
      onCancel={onClose}
      cancelText={null}
      showCloseX={false}
      okText={_t('prediction.know')}
      okButtonProps={{ style: { marginTop: '-12px', backgroundColor: THEME_COLOR.primary } }}
    >
      <BodyWrapper>
        <div className="activity-end-text">{_t('prediction.ended')}</div>
      </BodyWrapper>
    </Dialog>
  );
};

// 中奖提醒弹窗
export const WinnerTipDialog = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { isInApp } = useSelector(state => state.app);
  const { showWinnerTipDialog, winnerTipInfo } = useSelector(state => state.prediction);
  const { id, closeTime, amount } = winnerTipInfo || {};
  const date = getUtcZeroTime(closeTime, 'YYYY/MM/DD');
  const time = getUtcZeroTime(closeTime, 'HH:mm:ss');
  const priceAmount = separateNumber(amount);
  // 关闭弹窗
  const onClose = useCallback(
    () => {
      dispatch({
        type: 'prediction/closeWinnerTip',
        payload: {
          id,
        },
      });
    },
    [dispatch, id],
  );
  const goList = useCallback(
    debounce(
      url => {
        const targetUrl = `${LANDING_HOST}${url}`;
        // 跳转
        if (url && isInApp) {
          const _url = `/link?url=${encodeURIComponent(targetUrl)}`;
          JsBridge.open({
            type: 'jump',
            params: {
              url: _url,
            },
          });
        } else {
          push(url);
        }
        dispatch({
          type: 'prediction/closeWinnerTip',
          payload: {
            id,
          },
        });
      },
      500,
      { leading: true, trailing: false },
    ),
    [push, isInApp, id],
  );
  return (
    <Dialog
      size="mini"
      open={showWinnerTipDialog}
      title={_t('wy5vgvpo62niuukdmnyosF')}
      showCloseX={false}
      footer={null}
    >
      <BodyWrapper>
        <div className="winnerInfo">
          <div>{_t('f2ftzStBRHy6iFT1mpG4tj', { date, time })}</div>
          <div>{_t('dqdjaJFP7rwcm4eTTi2oBW', { amount: priceAmount })}</div>
        </div>
        <ButtonWrapper>
          <WrapButton onClick={() => goList('/prediction/detail?queryType=1')}>
            {_t('x14zTNDuH1g5r8nrtpueRs')}
          </WrapButton>
        </ButtonWrapper>
        <CancelButton type="text" onClick={onClose}>
          {_t('fWo4GifDZGZMFhmDTy86pX')}
        </CancelButton>
      </BodyWrapper>
    </Dialog>
  );
};
