/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import { _t, _tHTML } from 'utils/lang';
import Components from './Common';
import { cryptoCupTrackClick, cryptoCupExpose } from '../config';
import HelpPng from 'assets/cryptoCup/help2.png';

const {
  BannerBox,
  HighBanner,
  OkButton,
  CancelButtonBox,
  CancelButton,
  Intro,
  MainText,
} = Components;

const SucModal = () => {
  const dispatch = useDispatch();
  const { helpModalName, invitor } = useSelector(state => state.cryptoCup);
  const open = helpModalName === 'success';

  const handleCancel = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          helpModalName: '',
        },
      });
    },
    [dispatch],
  );

  const handleOk = useCallback(
    () => {
      handleCancel();
      cryptoCupTrackClick(['succeed', '1']);
    },
    [handleCancel],
  );

  useEffect(
    () => {
      if (open) {
        cryptoCupExpose(['succeed', '1']);
      }
    },
    [open],
  );

  return (
    <CupCommonDialog open={open} header={null}>
      <BannerBox>
        <HighBanner src={HelpPng} alt="banner" />
      </BannerBox>
      <Intro>{_t('8QgyLgCJ76u8RZWG1xqxuo', { account: invitor })}</Intro>
      <MainText>
        <>
          {_t('kEdUF6J7okAhvURXpjkSz1')}
          <br />
          {_tHTML('doymgvnWi2niiyZLRFhrmG', { num: 1000 })}
        </>
      </MainText>
      <OkButton fullWidth onClick={handleOk}>
        {_t('orK6F5EQVpanjS1FFm1XbT')}
      </OkButton>
      <CancelButtonBox>
        <CancelButton onClick={handleCancel}>{_t('vyu6VD4DgiDfUP9z2G6dGX')}</CancelButton>
      </CancelButtonBox>
    </CupCommonDialog>
  );
};

export default SucModal;
