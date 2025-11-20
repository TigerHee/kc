/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { StyledFooter } from '../styledComponents';

export default function Footer() {
  const isInApp = JsBridge.isApp();
  return <StyledFooter isInApp={isInApp} />;
}
