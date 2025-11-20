/**
 * Owner: sean.shi@kupotech.com
 */
import JsBridge from 'tools/jsBridge';
import { useTheme } from '@kux/design';
import useIsMobile from '../../../../hooks/useIsMobile';
import { ArrowLeft2Icon, CustomerServiceIcon } from '@kux/iconpack';
import cls from 'classnames';
import { useEffect } from 'react';
import SupportBot from 'packages/supportBot';
import { getTenantConfig } from '../../../../config/tenant';
import { useLang } from '../../../../hookTool';
import addLangToPath from 'tools/addLangToPath';
import { getSiteConfig } from 'kc-next/boot';
import styles from './index.module.scss';

export const Back = props => {
  const { onBack, title } = props;
  const { t } = useLang();
  const isMobile = useIsMobile();
  const isInApp = JsBridge.isApp();
  const theme = useTheme();
  const handleBack = () => {
    onBack?.();
  };

  const handleCustomer = () => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: `/link?url=${encodeURIComponent(
            addLangToPath(`${getSiteConfig()?.KUCOIN_HOST}${getTenantConfig().common.appBotPath}?source=login`)
          )}`,
        },
      });
    } else {
      const newWindow = window.open(addLangToPath(`${getTenantConfig().common.appBotPath}?source=login`));
      if (newWindow) {
        newWindow.opener = null;
      }
    }
  };

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
    <>
      <div className={cls(isInApp && styles.wrapperApp)}>
        <div className={cls(styles.container, isMobile && styles.containerH5, isInApp && styles.containerApp)}>
          {title && <div className={styles.title}>{title}</div>}
          <div className={styles.left} onClick={handleBack}>
            <ArrowLeft2Icon size={20} className={styles.back} />
            {!isMobile && <span className={styles.backText}>{t('8RcupwHqYraGhrjT8kAzG7')}</span>}
          </div>
          {isMobile && !getTenantConfig().forgetPwd.hideCustomer ? (
            <div className={styles.right} onClick={handleCustomer}>
              <CustomerServiceIcon size={20} className={styles.customer} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
