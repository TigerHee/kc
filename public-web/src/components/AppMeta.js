/**
 * Owner: chris@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Helmet } from 'react-helmet';

const AppMeta = () => {
  const isApp = JsBridge.isApp();
  if (!isApp) return null;
  return (
    <Helmet>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
    </Helmet>
  );
};

export default AppMeta;
