/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';

// 决赛 finals
// 半决赛 semifinal
// 四分之一决赛 quarterfinal
// 其他 other

function useGetCurrentSchedule() {
  const { campaigns } = useSelector(state => state.cryptoCup);
  const obj = (campaigns?.seasons || []).find(el => el.id === campaigns?.currentSeasonId);

  if (obj?.nameEn === '2TO1') {
    return 'finals';
  }

  if (obj?.nameEn === '4TO2') {
    return 'semifinal';
  }

  if (obj?.nameEn === '8TO4') {
    return 'quarterfinal';
  }

  return 'other';
}

export default useGetCurrentSchedule;
