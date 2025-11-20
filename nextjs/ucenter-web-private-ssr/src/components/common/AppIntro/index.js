import JsBridge from 'gbiz-next/bridge';
import { Button, HStack, useIsMobile, VStack } from '@kux/design';
import { ArrowRightIcon } from '@kux/iconpack';
import clsx from 'classnames';
import { Back } from 'components/Account/Security/Back';
import * as styles from './index.module.scss';

/**
 *  App 端安全项介绍页面
 */
const AppIntro = ({
  className = '',
  account,
  icon,
  pageTitle,
  onBack,
  bindIntroInfo,
  editIntroInfo,
}) => {
  const { title: editTitle, list } = editIntroInfo || {};
  const { title, desc, btnText, onBind, extra = null } = bindIntroInfo || {};

  const isInApp = JsBridge.isApp();
  const isH5 = useIsMobile();

  return (
    <div
      className={clsx(
        styles.container,
        isH5 && styles.containerH5,
        isInApp && styles.containerApp,
        className,
      )}
    >
      <Back onBack={onBack} title={isInApp ? pageTitle : ''} showBot hideAppBot />
      {!isInApp && <div className={styles.title}>{pageTitle}</div>}
      <div className={styles.intro}>
        <div className={styles.introContent}>
          <div className={styles.introIcon}>
            <img src={icon} alt="intro-icon" />
          </div>
          {account
            ? editIntroInfo && (
              <>
                <div className={`${styles.introDesc} edit-title`}>{editTitle}</div>
                {typeof account !== 'boolean' && (
                  <div className={styles.introTitle}>{account}</div>
                )}
                <VStack fullWidth className={styles.introList}>
                  {list.map((item) => (
                    <HStack
                      key={item.title}
                      fullWidth
                      align="center"
                      justify="space-between"
                      onClick={item.onClick}
                    >
                      <Button className={styles.button} type="text">
                        {item.title}
                      </Button>
                      <ArrowRightIcon className={styles.icon} size={16} />
                    </HStack>
                  ))}
                </VStack>
              </>
            )
            : bindIntroInfo && (
              <>
                <div className={styles.introTitle}>{title}</div>
                {desc ? <div className={styles.introDesc}>{desc}</div> : null}
              </>
            )}
        </div>
        {!account && bindIntroInfo && (
          <div className={styles.introFooter}>
            <Button type="primary" fullWidth onClick={onBind}>
              {btnText}
            </Button>
            {extra}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppIntro;
