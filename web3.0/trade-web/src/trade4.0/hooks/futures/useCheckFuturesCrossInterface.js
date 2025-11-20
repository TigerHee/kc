/**
 * Owner: garuda@kupotech.com
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { forEach } from 'lodash';

import { trackClick } from 'utils/ga';
import { _t } from 'utils/lang';

import { styled } from '@kux/mui';

import Button from '@mui/Button';

import { useGetAbnormal } from '@/components/AbnormalBack/hooks';
import { FUTURES_ERROR_RELOAD } from '@/meta/futuresSensors/trade';
import { useOperatorResultPrompt } from '@/pages/Futures/components/ResultPromptDialog/hooks';

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 32px 32px;
  button {
    display: flex;
    flex: 1;
    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }
`;

const useCheckFuturesCrossInterface = () => {
  const dispatch = useDispatch();
  const isShow = useRef(null);
  const crossAbnormal = useGetAbnormal();
  const { onOpenDialog, onCloseDialog } = useOperatorResultPrompt();

  const handleRefresh = useCallback(() => {
    try {
      trackClick([FUTURES_ERROR_RELOAD, '2']);
      window?.location && window.location.reload();
    } catch (e) {
      dispatch({
        type: 'notice/feed',
        payload: {
          type: 'message.warning',
          message: _t('network.timeout.tips'),
        },
      });
    }
  }, [dispatch]);

  const handleCloseDialog = useCallback(() => {
    onCloseDialog();
    trackClick([FUTURES_ERROR_RELOAD, '3']);
  }, [onCloseDialog]);

  useEffect(() => {
    let showErrorDialog = false;
    forEach(crossAbnormal, (item) => {
      if (!item) {
        showErrorDialog = true;
      }
    });
    console.log('showError --->', showErrorDialog, crossAbnormal);
    if (showErrorDialog && !isShow?.current) {
      onOpenDialog({
        type: 'warning',
        title: _t('network.timeout'),
        content: _t('network.timeout.tips'),
        footer: (
          <ButtonGroup>
            <Button type="default" onClick={handleCloseDialog}>
              {_t('cancel')}
            </Button>
            <Button type="primary" onClick={handleRefresh}>
              {_t('refresh')}
            </Button>
          </ButtonGroup>
        ),
      });
      isShow.current = true;
      // 上报弹框
      trackClick([FUTURES_ERROR_RELOAD, '1']);
    }
  }, [crossAbnormal, handleCloseDialog, handleRefresh, onOpenDialog]);
};

export default useCheckFuturesCrossInterface;
