/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useIsMobile, useTheme } from '@kux/design';
import { ArrowLeft2Icon, CustomerServiceIcon } from '@kux/iconpack';
import cls from 'classnames';
import NoSSG from 'components/NoSSG';
import { tenantConfig } from 'config/tenant';
import find from 'lodash-es/find';
import pathToRegexp from 'path-to-regexp';
import { useEffect, useState } from 'react';
import { getAdaEntraceConfig } from 'services/user';
import { addLangToPath, _t } from 'tools/i18n';
import { securityGoBack } from 'utils/router';
import siteConfig from 'utils/siteConfig';
import * as styles from './index.module.scss';

const KUCOIN_HOST = siteConfig.KUCOIN_HOST;

export const Back = (props) => {
  const { onBack, title, showBot, hideAppBot = false } = props;
  const isMobile = useIsMobile();
  const isInApp = JsBridge.isApp();
  const theme = useTheme();
  const [source, setSource] = useState('');
  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack();
    } else {
      securityGoBack();
    }
  };

  const handleCustomer = () => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${encodeURIComponent(
            addLangToPath(`${KUCOIN_HOST}${tenantConfig.common.appBotPath}?source=${source}`),
          )}`,
        },
      });
    } else {
      window.open(
        addLangToPath(`${KUCOIN_HOST}${tenantConfig.common.appBotPath}?source=${source}`),
        '_blank',
      );
    }
  };

  const doesUrlMatch = (url, currentLocation) => {
    const { href: currentHref, pathname: currentPathname, origin: currentOrigin } = currentLocation;
    const hrefWithLang = addLangToPath(url);
    let patternPath = '';
    let candidateHref = '';
    try {
      // 使用 base 解析，兼容相对路径与含有 :param 的模式
      const candidate = new URL(hrefWithLang, currentOrigin);
      patternPath = candidate.pathname;
      candidateHref = candidate.href;
      // 使用 path-to-regexp 对 pathname 做模式匹配（支持 /a/b/:test 等）
      const re = pathToRegexp(patternPath);
      if (re.test(currentPathname)) return true;
      // 兜底：保持与旧逻辑一致的完整 href 精确匹配
      return candidateHref === currentHref;
    } catch (err) {
      if (_DEV_) {
        console.warn('SupportBot parsing url error:', url, err);
      }
      return false;
    }
  };

  // 获取数据
  useEffect(() => {
    (async () => {
      try {
        const res = await getAdaEntraceConfig();
        const { success, data } = res || {};
        if (success) {
          const currentHref = window.location.href;
          const currentPathname = window.location.pathname;
          const currentOrigin = window.location.origin;
          const item = find(data, (item) => {
            if (!item?.entryUrl) return false;
            // 分割URL并去除空格，然后检查是否有匹配
            const urls = item.entryUrl
              .split(',')
              .map((url) => url.trim())
              .filter(Boolean);

            return urls.some((url) =>
              doesUrlMatch(url, {
                href: currentHref,
                pathname: currentPathname,
                origin: currentOrigin,
              }),
            );
          });
          console.log('item..', item);
          const { open, source: itemSource } = item || {};
          setSource(open ? itemSource : '');
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    // 如果使用这个 back 组件的，就将 header 隐藏
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          // statusBarIsLightMode: false, // 状态栏文字颜色为白色
          statusBarIsLightMode: theme !== 'dark', // 状态栏文字颜色 false白色 true黑色
          statusBarTransparent: true,
          visible: false,
        },
      });
    }
  }, [isInApp, theme]);

  return (
    <NoSSG>
      <div className={cls(isInApp && styles.wrapperApp)}>
        <div
          className={cls(
            styles.container,
            isMobile && styles.containerH5,
            isInApp && styles.containerApp,
          )}
        >
          {title && <div className={styles.title}>{title}</div>}
          <div className={styles.left} onClick={handleBack}>
            <ArrowLeft2Icon size={20} className={styles.back} />
            {!isMobile && <span className={styles.backText}>{_t('back')}</span>}
          </div>

          {isMobile && showBot && !hideAppBot && (
            <div className={styles.right} onClick={handleCustomer}>
              <CustomerServiceIcon size={20} className={styles.customer} />
            </div>
          )}
        </div>
      </div>
    </NoSSG>
  );
};
