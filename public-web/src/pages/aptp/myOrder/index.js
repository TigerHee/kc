/**
 * Owner: solar.xia@kupotech.com
 */
import { replace } from 'utils/router';

export default () => {
  const search = window.location.search;
  replace(`/pre-market/myOrder${search}`);
  return <div />;
};
