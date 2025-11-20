/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { useCallback } from 'react';
import prize1 from 'src/assets/referFriend/prize1.svg';
import prize0 from 'src/assets/referFriend/prize0.svg';
import prize2 from 'src/assets/referFriend/prize2.svg';
import prize3 from 'src/assets/referFriend/prize3.svg';
import prize4 from 'src/assets/referFriend/prize4.svg';
import prize5 from 'src/assets/referFriend/prize5.svg';
import prizeFace from 'src/assets/referFriend/prize-face.svg';

export const Icon_Map = {
  prize0,
  prize1,
  prize2,
  prize3,
  prize4,
  prize5,
  prizeFace,
};

const usePrize = ({}) => {
  const getPrizeIconUrl = useCallback(({ info = {} } = {}) => {
    const { couponType, type, awardId } = info;
    return Icon_Map[awardId] || prizeFace;
  }, []);

  return {
    getPrizeIconUrl,
  };
};

export default usePrize;
