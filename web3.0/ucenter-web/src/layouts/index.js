/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import Root from 'components/Root';
import useHtmlLang from 'hooks/useHtmlLang';
import useRouteChange from 'hooks/useRouteChange';
import useTdk from 'hooks/useTdk';
import _ from 'lodash';
import { isTMA } from 'utils/tma/bridge';

const getLayoutType = ({ pathname, query = {} }) => {
  let type = Root.LayoutType.BOTH;
  // 判断是否是在App中
  const isInApp = JsBridge.isApp();

  // app内始终不显示Header与Footer
  if (isInApp || isTMA()) {
    return Root.LayoutType.ONLYMAIN;
  }

  const config = {
    '/ucenter': () => {
      const excludePath = ['/ucenter/signin', '/ucenter/signup', '/ucenter/reset-password'];
      const isNeedRootHead = _.indexOf(excludePath, pathname) < 0;
      return isNeedRootHead ? Root.LayoutType.ONLYHEAD : Root.LayoutType.ONLYMAIN;
    },
    '/utransfer': Root.LayoutType.ONLYMAIN,
    '/restrict': Root.LayoutType.ONLYMAIN,
    '/oauth': Root.LayoutType.ONLYMAIN,
    '/account-compliance': Root.LayoutType.ONLYMAIN,
    '/account/kyc/tax': Root.LayoutType.ONLYMAIN,
  };

  Object.keys(config).forEach((_path) => {
    if (_.startsWith(pathname, _path)) {
      const _type = config[_path];

      if (_type) {
        if (typeof _type === 'function') {
          type = _type();
        } else {
          type = _type;
        }
      }
    }
  });
  return type;
};

export default (props) => {
  const {
    history: {
      location: { pathname, query },
    },
  } = props;
  const type = getLayoutType({
    pathname,
    query,
  });

  useHtmlLang();
  useRouteChange();
  useTdk();

  if (_.startsWith(pathname, '/404')) {
    return <>{props.children}</>;
  }

  return <Root type={type}>{props.children}</Root>;
};
