/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import { _t, _tHTML } from 'utils/lang';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import useRaceResult from '../hooks/useRaceResult';
import Components from './Common';
import { genPrizeNameAndValue } from '../config';

const { Title, NoticeText, FullButton, SeeContainer, SeeButton, CenterAward } = Components;

const FailBlindboxModal = props => {
  const { isSimple = false } = props; // 场次奖励
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { failRewardModalVisible = false, isFinalRace, openedRewards } = useSelector(
    state => state.cryptoCup,
  ); // isFinalRace是否决赛，唤起时控制
  const { curAward, isSingle, isFinalAward, closeAwardFunc } = useRaceResult();
  const awardTarget = useMemo(
    () => {
      if (isSimple) return get(openedRewards, '0', {});
      return get(curAward, 'data[0]', {});
    },
    [isSimple, openedRewards, curAward],
  );
  // 场次奖励，就展示场次字段，否则展示领奖的数据
  const { awardNameEn, logo, valueOfUsdt } = awardTarget;

  const CalcedTitle = useMemo(
    () => {
      if (isFinalRace)
        return (
          <Title>
            <>{_t('vrxhTnE3pk8vTmpiw6ZZy9')}</>
            <p>{_tHTML('jc44W33pPjHJxjSKibHyGV', { num: 20000 })}</p>
          </Title>
        );
      return (
        <Title>
          <>{_t('h5fGFZWisWjM9bPGe33Arc')}</>
          <br />
          <>{_tHTML('tT8rCqKGTr77B4WKvxBFTg', { prize: awardNameEn })}</>
        </Title>
      );
    },
    [isFinalRace, awardNameEn],
  );

  const handleClose = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          failRewardModalVisible: false,
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
            <FullButton fullWidth onClick={handleClose}>
              {_t('o6bocKR9Utm77Ar7a3MdAe')}
            </FullButton>
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
    [isSimple, isFinalRace, isFinalAward, isSingle, handleClose, goAward],
  );

  return (
    <CupCommonDialog open={failRewardModalVisible} onCancel={closeAwardFunc}>
      <>
        {CalcedTitle}
        {isFinalRace ? (
          <CenterAward />
        ) : (
          <CenterAward logo={logo} name={genPrizeNameAndValue(awardNameEn, valueOfUsdt)} />
        )}
      </>
      <NoticeText>
        {isFinalRace ? _t('gYaWqXsLzrTkBzZTcEttQq') : _t('racLGNsYLa7jB6ewTJoiX3', { num: 5 })}
      </NoticeText>
      <>{renderButton}</>
    </CupCommonDialog>
  );
};

export default FailBlindboxModal;
