/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'dva';
import { get } from 'lodash';
import { _t, _tHTML } from 'utils/lang';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import { SEASON_NAME_MAP, SEASON_NEXT_MAP, genPrizeNameAndValue } from '../config';
import useRaceResult from '../hooks/useRaceResult';
import Components from './Common';
import rightArrow from 'assets/cryptoCup/right-arrow.svg';

const {
  Title,
  AwardLine,
  AwardItem,
  AwardLogo,
  AwardName,
  NoticeText,
  FullButton,
  SeeContainer,
  SeeButton,
  CenterAward,
  ArrowRight,
  FullFlexButton,
  FullButtonText,
} = Components;

const SucBlindboxModal = props => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { isSimple = false } = props; // 场次奖励
  const { sucRewardModalVisible = false, isFinalRace, openedRewards, seasonNameEn } = useSelector(
    state => state.cryptoCup,
  ); // isFinalRace是否决赛，唤起时控制
  console.log('start======>sucRewardModalVisible :', sucRewardModalVisible, '======>end');

  const { curAward, isSingle, isFinalAward, closeAwardFunc } = useRaceResult(true);
  const { data } = curAward || {};

  // 场次奖励，就展示场次字段，否则展示领奖的数据
  const awardList = useMemo(
    () => {
      if (isSimple) return openedRewards;
      return data || [];
    },
    [isSimple, openedRewards, data],
  );
  const seasonName = useMemo(
    () => {
      if (isSimple) return seasonNameEn;
      return get(curAward, 'seasonNameEn', undefined);
    },
    [isSimple, curAward, seasonNameEn],
  );
  const seasonNameFunc = get(SEASON_NAME_MAP, seasonName, () => null);
  const seasonNextNameFunc = get(SEASON_NEXT_MAP, seasonName, () => null);

  const names = useMemo(
    () => {
      return awardList.reduce((acc, item, index, arr) => {
        const str = index === arr.length - 1 ? item.awardNameEn : `${item.awardNameEn} &`;
        acc += str;
        return acc;
      }, '');
    },
    [awardList],
  );

  const CalcedTitle = useMemo(
    () => {
      if (isFinalRace)
        return (
          <Title>
            <>{_t('nrJoGuQ8oAswwAnb3PMmVT')}</>
            <p>{_tHTML('jc44W33pPjHJxjSKibHyGV', { num: 50000 })}</p>
          </Title>
        );
      return (
        <Title>{_tHTML('i5JmVVLJnhC9f3fTDQusDm', { name: seasonNameFunc(), prize: names })}</Title>
      );
    },
    [isFinalRace, seasonNameFunc, names],
  );

  const handleClose = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          sucRewardModalVisible: false,
        },
      });
    },
    [dispatch],
  );

  const goAward = useCallback(
    () => {
      handleClose();
      push('/crypto-cup-my');
    },
    [push, handleClose],
  );

  const renderButton = useMemo(
    () => {
      // 查看场次奖励
      if (isSimple)
        return (
          <FullButton fullWidth onClick={handleClose}>
            {_t('j7L4pgXJ2axRhwXZnmUzK1')}
          </FullButton>
        );
      //只有一轮并且是决赛
      if (isSingle && isFinalRace) {
        return (
          <FullButton fullWidth onClick={goAward}>
            {_t('8NuNy3pk5nW5cYBknyofrQ')}
          </FullButton>
        );
      }
      //只有一轮并且非决赛
      if (isSingle && !isFinalRace) {
        return (
          <>
            <FullFlexButton fullWidth onClick={handleClose}>
              <FullButtonText>
                {_t('gRLkkhsxZHoMDtVwN6omFQ', { name: seasonNextNameFunc() })}
              </FullButtonText>
              <ArrowRight src={rightArrow} alt="" />
            </FullFlexButton>
            <SeeContainer>
              <SeeButton onClick={goAward}>{_t('eecr5KsbbYyNQxeed9Y3i3')}</SeeButton>
            </SeeContainer>
          </>
        );
      }
      // 多轮时最后一轮
      if (isFinalAward) {
        return (
          <FullButton fullWidth onClick={goAward}>
            {_t('8NuNy3pk5nW5cYBknyofrQ')}
          </FullButton>
        );
      }
      // 多轮时非最后一轮
      return null;
    },
    [isSimple, isFinalRace, isFinalAward, isSingle, handleClose, goAward, seasonNextNameFunc],
  );

  return (
    <CupCommonDialog open={sucRewardModalVisible} footer={null} onCancel={closeAwardFunc}>
      <>
        {CalcedTitle}
        {isFinalRace ? (
          <CenterAward />
        ) : (
          <AwardLine>
            {awardList.map((item, index) => {
              const { awardNameEn, logo, valueOfUsdt } = item;
              return (
                <AwardItem key={index}>
                  <AwardLogo src={logo} alt="award-logo" />
                  <AwardName>{genPrizeNameAndValue(awardNameEn, valueOfUsdt)}</AwardName>
                </AwardItem>
              );
            })}
          </AwardLine>
        )}
      </>
      <NoticeText>
        {isFinalRace ? _t('gYaWqXsLzrTkBzZTcEttQq') : _t('racLGNsYLa7jB6ewTJoiX3', { num: 5 })}
      </NoticeText>
      <>{renderButton}</>
    </CupCommonDialog>
  );
};

export default SucBlindboxModal;
