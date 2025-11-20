import { useSelector, useDispatch } from 'react-redux';
import storage from '@utils/storage';
import { namespace } from './model';
import {
  isIOS,
  hasBeenALongTime,
  isMobile,
  checkIfIsStandAlone,
  isInApp,
  isIOSSupportPWA,
  isChrome,
  isSafari,
} from '../common/tools';
import IOSTip from './IOSTip';

export default function PWATip() {
  const states = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();
  const stHiddenTipTime = storage.getItem('__kc_hidden_pwa_tip_time__');
  const hiddenTip = stHiddenTipTime ? hasBeenALongTime(stHiddenTipTime) <= 30 : false; // 关闭后一周内不提示
  const isStandAlone = checkIfIsStandAlone();

  const handleCloseTip = (showPwaTip) => {
    dispatch({ type: `${namespace}/update`, payload: { showPwaTip } });
  };

  const handleClose = () => {
    handleCloseTip(false);
    storage.setItem('__kc_hidden_pwa_tip_time__', new Date());
  };

  if (
    isInApp ||
    !states.showPwaTip ||
    hiddenTip ||
    isStandAlone ||
    !isMobile() ||
    !isIOS() ||
    !(isChrome() || isSafari()) ||
    (isChrome() && !isIOSSupportPWA())
  ) {
    return null;
  }

  return <IOSTip onClose={handleClose} />;
}
