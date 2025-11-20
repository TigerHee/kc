/**
 * Owner: chris@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { withNativeProps } from './utils';

import { styled } from '@kux/mui';
import { levelConfigMap } from '../../config';

const StyledSafeArea = styled.div`
  display: block;
  width: 100%;
  background-color: ${({ currentLevel }) =>
    levelConfigMap[currentLevel]?.overlayColor || '#010101'};
  padding-top: ${({ position }) => (position === 'top' ? `env(safe-area-inset-top, 0px)` : '0px')};
  padding-bottom: ${({ position }) =>
    position === 'bottom' ? `env(safe-area-inset-bottom)` : '0px'};
`;

const SafeArea = (props) => {
  const { position, currentLevel } = props;
  const isInApp = JsBridge.isApp();
  if (!isInApp) return null;
  return withNativeProps(props, <StyledSafeArea position={position} currentLevel={currentLevel} />);
};

export default SafeArea;
