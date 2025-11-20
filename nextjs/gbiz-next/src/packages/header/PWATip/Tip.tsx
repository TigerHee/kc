import storage from 'tools/storage';
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
import { useHeaderStore } from '../Header/model';

export default function PWATip() {
  const stHiddenTipTime = storage.getItem('__kc_hidden_pwa_tip_time__');
  const hiddenTip = stHiddenTipTime ? hasBeenALongTime(stHiddenTipTime) <= 30 : false; // 关闭后一周内不提示
  const isStandAlone = checkIfIsStandAlone();
  const showPwaTip = useHeaderStore(state => state.showPwaTip);
  const updateHeader = useHeaderStore(state => state.updateHeader);

  const handleCloseTip = (showPwaTip) => {
    updateHeader?.({ showPwaTip });
  };

  const handleClose = () => {
    handleCloseTip(false);
    storage.setItem('__kc_hidden_pwa_tip_time__', String(new Date().valueOf()));
  };

  if (
    isInApp ||
    !showPwaTip ||
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
