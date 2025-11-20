/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { useKuxMediaQuery } from 'src/hooks';
import JsBridge from 'utils/jsBridge';

import Footer from 'components/Footer/KCFooter';

export function PageFooter() {
  const { downSm } = useKuxMediaQuery();
  const isInApp = JsBridge.isApp();

  if (isInApp || downSm) {
    return null;
  }

  return (
    <Footer />
  );
}
