/**
 * Owner: kevyn.yu@kupotech.com
 */
import { matchPath } from 'react-router-dom';

const handleMatch = ({ path, pathMap, args }) => {
  const [, pathnameWithoutLang] = window.location.pathname.split('/learn');
  return pathMap[path](matchPath(`/learn${pathnameWithoutLang}`, { path }), args);
};

const injectCodeByMatch =
  (event = 'expose', pathMap = {}) =>
  (args) => {
    if (args?.event !== event) return;
    for (const path in pathMap) {
      const result = handleMatch({ path, pathMap, args });
      if (result) {
        return result;
      }
    }
  };

export default injectCodeByMatch;

export const injectPageTitleWhenExpose = injectCodeByMatch('expose', {
  '/learn/:category/:title': (match, args) => {
    return match?.params?.title;
  },
  '/learn/:category': (match, args) => {
    return match?.params?.category;
  },
});
