/**
 * Owner: jesse.shao@kupotech.com
 */
import { useMemo, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'dva';
import { isNil, findLastIndex } from 'lodash';
import { toastByCode, toastNoScore, isFinalRaceFunc } from 'components/$/CryptoCup/config';

const useRaceResult = isListen => {
  const dispatch = useDispatch();
  const [runFlag, setRunFlag] = useState(false);
  const { obtainedList, curIndex } = useSelector(state => state.cryptoCup);
  // 当前的数据
  const curAward = (obtainedList || [])[curIndex] || {};

  // 总轮数：code为200的数据数量
  const allTurns = useMemo(
    () => {
      return obtainedList.reduce((acc, item) => {
        if (String(item?.code) === '200') {
          acc++;
        }
        return acc;
      }, 0);
    },
    [obtainedList],
  );

  // 最后一条奖励的索引
  const finalAwardIndex = useMemo(
    () => findLastIndex(obtainedList, item => String(item?.code) === '200'),
    [obtainedList],
  );

  // 是否只有一轮
  const isSingle = useMemo(
    () => {
      return allTurns === 1;
    },
    [allTurns],
  );

  // 是否是最后一轮
  const isFinalAward = useMemo(
    () => {
      return curIndex === finalAwardIndex;
    },
    [finalAwardIndex, curIndex],
  );

  // 关闭弹窗
  const closeAwardFunc = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          sucRewardModalVisible: false,
          failRewardModalVisible: false,
        },
      });
      setTimeout(() => {
        dispatch({
          type: 'cryptoCup/selfAddCurIndex',
        });
      }, 1000);
    },
    [dispatch],
  );

  useEffect(
    () => {
      if (runFlag)
        setTimeout(() => {
          dispatch({
            type: 'cryptoCup/selfAddCurIndex',
          });
        }, 1000);
    },
    [runFlag, dispatch],
  );

  useEffect(
    () => {
      if (isListen) {
        setRunFlag(false);
        const { code, matchResult, seasonNameEn, seasonStatus } = curAward || {};

        if (String(code) === '500007') {
          toastNoScore();
          setRunFlag(true);
          return false;
        }
        if (String(code) === '500034') {
          setRunFlag(true);
          return false;
        }
        if (!isNil(code) && String(code) !== '200') {
          toastByCode(code);
          setRunFlag(true);
          return false;
        }
        if (String(code) === '200') {
          const _stateName = matchResult ? 'sucRaceModalVisible' : 'failRaceModalVisible';
          dispatch({
            type: 'cryptoCup/update',
            payload: {
              isFinalRace: isFinalRaceFunc(seasonNameEn, seasonStatus),
              [_stateName]: true,
            },
          });
        }
      }
    },
    [curAward, dispatch, isListen],
  );

  return {
    allTurns,
    isSingle,
    closeAwardFunc,
    isFinalAward,
    curAward,
  };
};

export default useRaceResult;
