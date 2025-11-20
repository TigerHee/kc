import {useTheme} from '@krn/ui';

const iconsConfig = {
  light: {
    guide: require('assets/light/guide.png'),
    service: require('assets/light/service.png'),
    back: require('assets/light/back.png'),
    suspensionWarning: require('assets/light/Suspension-warning.png'),
    suspensionError: require('assets/light/Suspension.png'),
    verified: require('assets/light/verified.png'),
    verifying: require('assets/light/verifying.png'),
    rejected: require('assets/light/rejected.png'),
    privacy: require('assets/light/privacy.png'),
    copy: require('assets/light/copy.png'),
    close: require('assets/light/close.png'),
    thai: require('assets/light/thai.png'),
    foreign: require('assets/light/foreign.png'),
    arrowRight: require('assets/light/arrow-right.png'),
    thaid: require('assets/light/thaid.png'),
    ndid: require('assets/light/ndid.png'),
    step1: require('assets/light/step1.png'),
    step2: require('assets/light/step2.png'),
    step3: require('assets/light/step3.png'),
    userType: require('assets/light/user-type.png'),
    drawerClose: require('assets/common/close.png'),
    btnOutlineArrow: require('assets/light/btn-outline-arrow.png'),
    selected: require('assets/light/pi/selected.png'),
    info: require('assets/common/info.png'),
    warn: require('assets/common/warn.png'),
    closeGray: require('assets/common/close-gray.png'),
  },
  dark: {
    guide: require('assets/dark/guide.png'),
    service: require('assets/dark/service.png'),
    back: require('assets/dark/back.png'),
    suspensionWarning: require('assets/dark/Suspension-warning.png'),
    suspensionError: require('assets/dark/Suspension.png'),
    verified: require('assets/dark/verified.png'),
    verifying: require('assets/dark/verifying.png'),
    rejected: require('assets/dark/rejected.png'),
    privacy: require('assets/dark/privacy.png'),
    copy: require('assets/dark/copy.png'),
    close: require('assets/dark/close.png'),
    thai: require('assets/dark/thai.png'),
    foreign: require('assets/dark/foreign.png'),
    arrowRight: require('assets/dark/arrow-right.png'),
    thaid: require('assets/dark/thaid.png'),
    ndid: require('assets/dark/ndid.png'),
    step1: require('assets/dark/step1.png'),
    step2: require('assets/dark/step2.png'),
    step3: require('assets/dark/step3.png'),
    userType: require('assets/dark/user-type.png'),
    drawerClose: require('assets/common/close.png'),
    btnOutlineArrow: require('assets/dark/btn-outline-arrow.png'),
    selected: require('assets/dark/pi/selected.png'),
    info: require('assets/common/info.png'),
    warn: require('assets/common/warn.png'),
    closeGray: require('assets/common/close-gray.png'),
  },
};
/**
 * @description: 获取黑白模式图片
 * @param {*} name
 * @return {*}
 */
const useIconSrc = name => {
  const {type} = useTheme();
  return iconsConfig[type][name];
};

export default useIconSrc;
