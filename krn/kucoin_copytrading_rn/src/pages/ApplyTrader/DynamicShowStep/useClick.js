import {useMemoizedFn} from 'ahooks';
import {useSelector} from 'react-redux';

import {useAuKycLevelModalControl} from 'components/GlobalModal/MountGlobalModal/hooks/useAuKycLevelModalControl';
import {RouterNameMap} from 'constants/router-name-map';
import useKyc from 'hooks/useKyc';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {useWithLoginFn} from 'hooks/useWithLoginFn';

export const useClickIntro = () => {
  const {push} = usePush();
  const isLeadTrader = useSelector(state => state.leadInfo.isLeadTrader);

  const {onClickTrack} = useTracker();

  const {validateAndOpenKycInfo} = useKyc();
  const {validateApplyTraderKycLevelRestrict} = useAuKycLevelModalControl();

  const doApply = useMemoizedFn(async () => {
    try {
      if (isLeadTrader) {
        return push(RouterNameMap.ApplySuccessResult);
      }
      const isPassKyc = await validateAndOpenKycInfo();

      if (!isPassKyc) return;

      const isPassKycLevelRestrict =
        await validateApplyTraderKycLevelRestrict();

      if (!isPassKycLevelRestrict) return;

      push(RouterNameMap.FillApplyTraderForm);
    } catch (error) {
      console.log('mylog ~ doApply ~ error:', error);
    }
  });

  const track = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'button',
      locationId: 'applyButton',
    });
  });

  const {run: gotoApplyPage} = useWithLoginFn(doApply, track);

  return {gotoApplyPage};
};
