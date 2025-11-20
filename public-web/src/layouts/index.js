/**
 * Owner: willen@kupotech.com
 */
import * as tma from '@kc/telegram-biz-sdk';
import JsBridge from '@knb/native-bridge';
import { Notification, Snackbar } from '@kufox/mui';
import { ThemeProvider as KuxThemeProvider } from '@kux/mui';
import Root from 'components/Root';
import useTdk from 'hooks/tdk/useTdk';
import useHtmlLang from 'hooks/useHtmlLang';
import useRouteChange from 'hooks/useRouteChange';
import _ from 'lodash';

const { SnackbarProvider } = Snackbar;
const { NotificationProvider } = Notification;

const getLayoutType = ({ pathname, query = {} }) => {
  let type = Root.LayoutType.BOTH;
  // 判断是否是在App中
  const isInApp = JsBridge.isApp();
  if (isInApp || tma.bridge.isTMA()) {
    return Root.LayoutType.ONLYMAIN;
  }
  const config = {
    '/cert': Root.LayoutType.ONLYHEAD,
    '/cert/qrcode': Root.LayoutType.ONLYMAIN,
  };
  Object.keys(config).forEach((_path) => {
    if (_.startsWith(pathname, _path)) {
      type = config[_path];
    }
  });
  return type;
};

/**
 * flatten routes
 *
 * @param   {[type]}  _routes  [_routes description]
 *
 * @return  {[type]}           [return description]
 */
function resolveRoutes(_routes) {
  return _routes.map((v) => {
    if (v.routes) {
      return [...resolveRoutes(v.routes)];
    }
    return v;
  });
}

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

  return (
    <KuxThemeProvider>
      <SnackbarProvider>
        <NotificationProvider>
          <Root type={type}>{props.children}</Root>
        </NotificationProvider>
      </SnackbarProvider>
    </KuxThemeProvider>
  );
};
