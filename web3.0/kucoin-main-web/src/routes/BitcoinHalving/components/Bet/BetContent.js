/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Spin } from '@kux/mui';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import storage from 'utils/storage';
import Content from './Content';
import Percent from './Percent';
import { BtnCont } from './index.style';

const STORAGE_NAME = 'bet_storage';
const BET_MAP = {
  0: 'GROWTH',
  1: 'FALL',
};
const coin = 'BTC';

export default ({ closeAminate = () => {} }) => {
  const [value, setValue] = useState();
  const dispatch = useDispatch();
  const { fallPercent, risePercent } = useSelector((state) => {
    return state.bitcoinHalving;
  });
  const beting = useSelector((state) => state.loading.effects[`bitcoinHalving/makeBet`]) || false;
  const getingResult =
    useSelector((state) => state.loading.effects[`bitcoinHalving/getBetResult`]) || false;

  useEffect(() => {
    const data = storage.getItem(STORAGE_NAME);
    if (data && data[coin] !== undefined) {
      setValue(data[coin]);
    }
  }, []);

  useEffect(() => {
    dispatch({ type: 'bitcoinHalving/getBetResult', payload: coin });
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      closeAminate();
    }
  }, [value, closeAminate]);

  const onClick = async (val) => {
    if (value !== undefined) return;
    closeAminate();
    try {
      const success = await dispatch({
        type: 'bitcoinHalving/makeBet',
        payload: {
          currency: coin,
          trendGuessEnum: BET_MAP[val],
        },
      });
      if (success) {
        setValue(val);
        const data = storage.getItem(STORAGE_NAME);
        storage.setItem(STORAGE_NAME, {
          ...(data ? data : {}),
          time: moment().utc(0).valueOf(),
          [coin]: val,
        });
        dispatch({ type: 'bitcoinHalving/getBetResult', payload: coin });
      }
    } catch (error) {}
  };

  return (
    <Spin spinning={beting || getingResult} type="normal">
      <BtnCont voted={value !== undefined} spinning={beting || getingResult}>
        {value === undefined ? (
          <Content upOnClick={() => onClick(0)} downOnClick={() => onClick(1)} />
        ) : (
          <Percent risePercent={risePercent} fallPercent={fallPercent} />
        )}
      </BtnCont>
    </Spin>
  );
};
