/**
 * Owner: willen@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { useLocale } from '@/hooks/useLocale';
import { useIsMobile, useTheme } from '@kux/design';
import { ArrowLeft2Icon } from '@kux/iconpack';
import cls from 'classnames';
import { useEffect } from 'react';
import { exit } from 'src/utils/runInApp';
import { _t } from 'tools/i18n';
import * as styles from './index.module.scss';

const Back = (props) => {
  useLocale();
  const { onClick, title } = props;

  const isInApp = JsBridge.isApp();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleBack = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    } else {
      if (isInApp) {
        exit();
      } else {
        window.history.go(-1);
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
    <div className={cls(styles.wrapper, isInApp && styles.wrapperApp)}>
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
      </div>
    </div>
  );
};

export default Back;
