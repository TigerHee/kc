/**
 * Owner: solar@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { withNativeProps } from './withNativeProps';

import { styled } from '@kux/mui';

const classPrefix = 'adm-safe-area';

const StyledSafeArea = styled.div`
  display: block;
  width: 100%;
  background-color: #121212;
  &.adm-safe-area-position-top {
    /* padding-top: env(safe-area-inset-top, 20px); */
    padding-top: 40px;
  }
  &.adm-safe-area-position-bottom {
    /* padding-bottom: env(safe-area-inset-bottom); */
    padding-bottom: 20px;
  }
`;

const SafeArea = (props) => {
  const isInApp = JsBridge.isApp();
  if (!isInApp) return null;
  return withNativeProps(
    props,
    <StyledSafeArea className={`${classPrefix}-position-${props.position}`} />,
  );
};

export default SafeArea;
