import {showToast} from '@krn/bridge';

import {PositionSideMap} from 'constants/future';

export const delayShowToast = text => {
  setTimeout(() => {
    showToast(text);
  }, 1000);
};

export const getIsTpDirection = ({positionSide, configStop}) =>
  (positionSide === PositionSideMap.Long && configStop === 'up') ||
  (positionSide === PositionSideMap.Short && configStop === 'down');
