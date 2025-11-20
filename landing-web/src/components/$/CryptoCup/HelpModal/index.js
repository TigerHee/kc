/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { searchToJson } from 'helper';
import { _t, _tHTML } from 'utils/lang';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import Components from './Common';
import { cryptoCupTrackClick, cryptoCupExpose } from '../config';
import HelpPng from 'assets/cryptoCup/help1.png';

const query = searchToJson();
const { scode } = query || {};

const {
  BannerBox,
  HighBanner,
  OkButton,
  CancelButtonBox,
  CancelButton,
  Intro,
  MainText,
} = Components;

const HelpModal = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  const { helpModalVisible, invitor } = useSelector(state => state.cryptoCup);
  const loading = useSelector(state => state.loading.effects['cryptoCup/assistShare']);

  const handleHelp = useCallback(
    async () => {
      cryptoCupTrackClick(['help', '1']);
      if (!isLogin) {
        dispatch({
          type: 'cryptoCup/update',
          payload: { helpModalName: 'login', helpModalVisible: false },
        });
        return;
      }
      await dispatch({
        type: 'cryptoCup/assistShare',
        payload: { scode },
      });
      dispatch({
        type: 'cryptoCup/update',
        payload: { helpModalVisible: false },
      });
    },
    [dispatch, isLogin],
  );

  const cancelHelp = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: { helpModalVisible: false },
      });
      cryptoCupTrackClick(['cancel', '1']);
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (helpModalVisible) {
        cryptoCupExpose(['help', '1']);
      }
    },
    [helpModalVisible],
  );

  return (
    <CupCommonDialog open={helpModalVisible} header={null}>
      <BannerBox>
        <HighBanner src={HelpPng} alt="banner" />
      </BannerBox>
      <Intro>{_t('8QgyLgCJ76u8RZWG1xqxuo', { account: invitor })}</Intro>
      <MainText>{_tHTML('c5eURrnbbU8yjmxpSk92vb', { num: 250000 })}</MainText>
      <OkButton fullWidth onClick={handleHelp} loading={loading}>
        {_t('st3Qj7pLTwkK9uT6iv7XjP')}
      </OkButton>
      <CancelButtonBox>
        <CancelButton onClick={cancelHelp}>{_t('1L716BwQbjgeLsb9KiX9cb')}</CancelButton>
      </CancelButtonBox>
    </CupCommonDialog>
  );
};

export default HelpModal;
