import {useWindowDimensions} from 'react-native';

const GUIDE_CENTER_TABS_HEIGHT = 64;

const SAFE_TOP_GAP_HEIGHT = 110;
export const useCalcPopupHeightHelper = () => {
  const screenHeight = Math.round(useWindowDimensions().height);
  const rootHeight = screenHeight - SAFE_TOP_GAP_HEIGHT;
  const panelScreenHeight = rootHeight - GUIDE_CENTER_TABS_HEIGHT;

  return {
    rootHeight,
    panelScreenHeight,
  };
};
